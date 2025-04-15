import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";

interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "admin";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "client" | "admin"
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
  set({ isLoading: true });
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Récupération du profil avec un seul résultat
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user?.id)
      .single();

    if (profileError) throw profileError;

    set({
      user: {
        id: data.user?.id!,
        name: profile.name,
        email: data.user?.email!,
        role: profile.role,
      },
      isAuthenticated: true,
    });

    toast.success("Connexion réussie !");
  } catch (error: any) {
    toast.error(error.message || "Email ou mot de passe incorrect");
  } finally {
    set({ isLoading: false });
  }
},

  register: async (name, email, password, role) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) throw error;

      // Le trigger handle_new_user créera automatiquement le profil
      // Mais on peut aussi le faire manuellement pour être sûr
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: data.user?.id,
          name,
          email,
          role,
        });

      if (profileError) throw profileError;

      set({
        user: {
          id: data.user?.id!,
          name,
          email,
          role,
        },
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success("Inscription réussie ! Vérifiez votre email.");
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.message || "Erreur lors de l'inscription");
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.success("Déconnexion réussie");
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.message || "Erreur lors de la déconnexion");
    }
  },

  fetchUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        set({
          user: {
            id: user.id,
            name: profile.name,
            email: user.email!,
            role: profile.role,
          },
          isAuthenticated: true,
        });
      }
    } catch (error) {
      set({ isAuthenticated: false, user: null });
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;

      toast.success("Lien de réinitialisation envoyé à votre email");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi du lien");
    } finally {
      set({ isLoading: false });
    }
  },
}));
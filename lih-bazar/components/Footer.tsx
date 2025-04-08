"use client";

import { useAuthStore } from '@/store/authStore';
import { Home, ShoppingBag, User, Settings, GalleryVertical } from 'lucide-react'; // Ajout de GalleryVertical
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const DynamicFooter = () => {
  const { user, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  const navigation = [
    {
      name: 'Accueil',
      href: '/',
      icon: Home,
    },
    // Ajout de la nouvelle entrée Galerie
    {
      name: 'Galerie',
      href: '/galerie',
      icon: GalleryVertical,
    },
    {
      name: 'Commandes',
      href: '/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Profil',
      href: '/profiles',
      icon: User,
    },
    ...(user.role === 'admin' ? [{
      name: 'Admin',
      href: '/admin',
      icon: Settings,
    }] : []),
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-lg mx-auto px-4">
        <nav className="flex justify-around items-center h-16">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex-1"
              >
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full h-14 flex flex-col items-center justify-center space-y-1 rounded-none hover:bg-gray-100',
                    isActive && 'text-primary border-t-2 border-primary'
                  )}
                >
                  <item.icon 
                    className={cn(
                      'h-5 w-5',
                      isActive ? 'text-primary' : 'text-gray-500'
                    )} 
                  />
                  <span className={cn(
                    'text-xs',
                    isActive ? 'text-primary font-medium' : 'text-gray-500'
                  )}>
                    {item.name}
                  </span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </footer>
  );
};

export default DynamicFooter;
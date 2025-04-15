"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";

const FOOD_CATEGORIES = [
  "Tous",
  "Fruits",
  "Légumes",
  "Produits Laitiers",
  "Boulangerie",
];

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        let query = supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (selectedCategory !== "Tous") {
          query = query.eq("category", selectedCategory);
        }

        const { data, error } = await query;

        if (error) throw error;

        setProducts(data as Product[]);
      } catch (error) {
        toast.error("Erreur lors du chargement des produits");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Nos Produits</h1>
        
        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {FOOD_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Liste des produits */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Aucun produit trouvé dans cette catégorie
          </div>
        )}
      </div>
    </div>
  );
}
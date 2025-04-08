"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import CategoryNav from "@/components/CategoryNav";
import { toast } from "react-toastify";

const LandingPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [isLoading, setIsLoading] = useState(true);

  // Catégories alimentaires
  const FOOD_CATEGORIES = [
    "Tous",
    "Fruits",
    "Légumes",
    "Produits Laitiers",
    "Boulangerie",
  ];

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setFeaturedProducts(data as Product[]);
      } catch (error) {
        toast.error("Erreur lors du chargement des produits");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "Tous"
      ? featuredProducts
      : featuredProducts.filter((p) => p.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {selectedCategory === "Tous"
              ? "Tous nos produits alimentaires"
              : `Produits ${selectedCategory}`}
          </h2>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Aucun produit trouvé dans cette catégorie
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

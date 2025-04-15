"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { Trash2, Search, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Utiliser useCallback pour éviter des rendus inutiles
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${searchTerm}%`);

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement: " + (error.message || "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Implémenter un debounce pour la recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 500);
    
    setDebounceTimeout(timeout);
  };

  useEffect(() => {
    fetchProducts();
    
    // Nettoyer le timeout lors du démontage
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Produit supprimé avec succès");
    } catch (error: any) {
      toast.error("Erreur lors de la suppression: " + (error.message || "Erreur inconnue"));
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ToastContainer />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestion des Produits</CardTitle>
              <CardDescription>
                {products.length} produit{products.length !== 1 && "s"}
              </CardDescription>
            </div>
            <Link href="/admin/products/new">
              <Button>Ajouter un produit</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 relative">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>{product.price.toLocaleString()} FCFA</TableCell>
                      <TableCell>
                        {product.stock > 0 ? (
                          <span className="text-green-600">{product.stock}</span>
                        ) : (
                          <span className="text-red-600">Épuisé</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="outline" size="sm">Éditer</Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Aucun produit trouvé. Essayez de modifier votre recherche ou 
              <Link href="/admin/products/new" className="text-primary hover:underline ml-1">
                ajoutez un nouveau produit
              </Link>.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
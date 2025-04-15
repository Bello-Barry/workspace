"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/ImageUploader";

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  description: z.string().min(1, "Description requise"),
  price: z.coerce.number().min(0.1, "Prix invalide"),
  stock: z.coerce.number().min(0, "Stock invalide"),
  category: z.string().min(1, "Catégorie requise"),
  images: z.string().min(1, "Au moins une image est requise"), 
});

type ProductFormData = z.infer<typeof schema>;

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
const [images, setImages] = useState<string[]>(product?.images || []);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setProduct(data);
        setValue("name", data.name);
        setValue("description", data.description);
        setValue("price", data.price);
        setValue("stock", data.stock);
        setValue("category", data.category);
        setUploadedImages(data.images);
      }
    };

    fetchProduct();
  }, [id, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({ ...data, images: uploadedImages })
        .eq("id", id);

      if (error) throw error;
      toast.success("Produit mis à jour");
      router.push("/admin/products");
    } catch (error) {
      toast.error("Erreur de mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return <div className="text-center p-8">Chargement...</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Éditer le produit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Nom du produit</label>
                <Input {...register("name")} />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label>Prix (FCFA)</label>
                <Input type="number" {...register("price")} />
                {errors.price && (
                  <p className="text-red-500">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div>
              <label>Description</label>
              <Textarea {...register("description")} rows={4} />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Stock</label>
                <Input type="number" {...register("stock")} />
                {errors.stock && (
                  <p className="text-red-500">{errors.stock.message}</p>
                )}
              </div>

              <div>
                <label>Catégorie</label>
                <Input {...register("category")} />
                {errors.category && (
                  <p className="text-red-500">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <label>Images</label>
              <ImageUploader 
  onUpload={(urls) => setImages(urls)} // Assurez-vous que cette fonction est définie
  bucket="images" // Ceci est requis selon l'interface ImageUploaderProps
  maxFiles={5} // Optionnel, par défaut à 5
/>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

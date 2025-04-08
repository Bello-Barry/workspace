"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { ShoppingCart, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "FCFA");
  };

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      toast.error(`Stock insuffisant (${product.stock} disponibles)`);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      images: product.images,
    });

    toast.success(
      <div className="flex items-center">
        <Check className="mr-2 h-5 w-5 text-green-500" />
        {quantity} unité{quantity > 1 ? "s" : ""} ajoutée
        {quantity > 1 ? "s" : ""}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <div className="relative aspect-square">
          <Image
            src={product.images[currentImageIndex]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <CardHeader>
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <div className="text-xl font-bold">
            {formatCurrency(product.price)}
          </div>
        </CardHeader>

        <CardContent className="mt-auto">
          <div className="flex flex-col gap-4">
            <div className="text-sm text-muted-foreground">
              {product.description}
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                min={1}
                className="w-20 text-center"
              />

              <Button
                onClick={handleAddToCart}
                className="flex-1 gap-2"
                disabled={quantity > product.stock}
              >
                <ShoppingCart className="h-4 w-4" />
                Ajouter
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Stock : {product.stock} unité{product.stock > 1 ? "s" : ""}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;

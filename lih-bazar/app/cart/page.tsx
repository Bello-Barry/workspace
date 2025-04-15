"use client";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const router = useRouter();

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Fonction pour obtenir la première image valide
  const getFirstValidImage = (images: string | string[]) => {
    const imageArray = typeof images === 'string' ? images.split(',') : images;
    return imageArray.find(img => {
      try {
        new URL(img);
        return true;
      } catch {
        return false;
      }
    }) || '/placeholder-product.jpg';
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <ShoppingCart className="mr-2 h-6 w-6" /> Panier
          </CardTitle>
        </CardHeader>

        <CardContent>
          <AnimatePresence>
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                Votre panier est vide
                <div className="mt-4">
                  <Button onClick={() => router.push('/')}>
                    Retour à la boutique
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.quantity}`}
                    className="flex items-center gap-4 py-4 border-b"
                  >
                    <div className="relative w-20 h-20">
                      <Image
                        src={getFirstValidImage(item.images)}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold">{item.name}</h3>

                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Math.max(1, Number(e.target.value)))
                          }
                          min={1}
                          className="w-20"
                        />

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="font-semibold">
                      {(item.price * item.quantity).toFixed(2)} FCFA
                    </div>
                  </motion.div>
                ))}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                      Total : {calculateTotal().toFixed(2)} FCFA
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={clearCart}
                      >
                        Vider le panier
                      </Button>
                      <Button 
                        size="lg" 
                        onClick={() => router.push("/checkout")}
                      >
                        Commander
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
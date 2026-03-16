"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Loader2, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice: number;
    images: string[];
    thumbnail: string;
    isActive: boolean;
  };
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/wishlist");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchWishlist();
    }
  }, [session]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/wishlist`, {
        headers: {
          Authorization: `Bearer ${(session as any)?.accessToken || ""}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setWishlist(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${(session as any)?.accessToken || ""}`,
        },
      });

      if (res.ok) {
        setWishlist(wishlist.filter((item) => item.productId !== productId));
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#EB6426]" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Save items you love to your wishlist.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#EB6426] text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden flex"
              >
                <div className="w-32 h-32 bg-gray-100 relative flex-shrink-0">
                  {item.product?.thumbnail || item.product?.images?.[0] ? (
                    <Image
                      src={item.product.thumbnail || item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Heart className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4 flex flex-col">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-medium text-gray-900 hover:text-[#EB6426] line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg font-bold text-[#EB6426]">
                      ${item.product.price.toFixed(2)}
                    </span>
                    {item.product.comparePrice > item.product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ${item.product.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="mt-auto flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-[#EB6426] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

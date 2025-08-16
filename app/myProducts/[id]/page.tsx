"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/app/components/Products";
import { RootState } from "@/store/appStore";
import { ProductOfUserInterface } from "@/slices/userSlice";
import { ProductOfUser } from "@/types/ProductOfUser";
import axios from "axios";
import { useSelector } from "react-redux";
import { Nunito } from 'next/font/google';
import toast , {Toaster} from "react-hot-toast"
import ProtectedRoute from "@/app/components/ProtectedRoute";
// Import the Nunito font
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700'] });

export default function MyProducts() {
  const currentUser = useSelector((store: RootState) => store.user.currentUser);
  const [products, setProducts] = useState<ProductOfUserInterface[] | null>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get<ProductOfUser>(
          `${process.env.NEXT_PUBLIC_API_URL!}/api/productsOfUser?id=${currentUser?._id}`
        );
        console.log(res);
        setProducts(res?.data?.productsOfUser);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, [currentUser?._id]);

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteProduct?id=${productId}`);
      setProducts((prev) => prev?.filter((p) => p._id !== productId) || []);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className={`${nunito.className} min-h-screen bg-[#111827] px-4 py-10`}>
        {/* Single heading */}
        <h2 className="text-white text-3xl sm:text-4xl font-extrabold text-center mb-12 tracking-wide">
          Here are your current products
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div
                key={String(product._id)}
                className="bg-[#1f2937] rounded-xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-200"
              >
                <ProductCard
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  showActions={true}
                  onDelete={() => handleDelete(String(product._id))}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-blue-400 col-span-3 text-lg font-medium">
              No products found. Start adding your first listing!
            </p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

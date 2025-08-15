"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/app/components/Products"; // adjust path if needed
import { RootState } from "@/store/appStore";
import { ProductOfUserInterface } from "@/slices/userSlice";
import {ProductOfUser} from "@/types/ProductOfUser"
import axios from "axios";
import { useSelector } from "react-redux";
export default function MyProducts() {
  const currentUser = useSelector((store: RootState) => store.user.currentUser);
  const [products, setProducts] = useState<ProductOfUserInterface[] | null>([]);

  // Fetch user products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get<ProductOfUser>(
          `${process.env.NEXT_PUBLIC_API_URL!}/api/productsOfUser?id=${currentUser?._id}`
        );
        console.log(res)
        setProducts(res?.data?.productsOfUser);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, [currentUser?._id]);

  // Update product handler
  const handleUpdate = (productId: string) => {
    // open update modal or navigate to update page
  };

  // Delete product handler
  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(`/api/products/${productId}`, { method: "DELETE" });
      setProducts((prev) => prev?.filter((p) => p._id !== productId) || []);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] px-3 py-10">
      {/* Centered Top Heading */}
      <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-10 font-sans tracking-wide">
        Here are your current products
      </h2>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl}
              showActions={true}
              onUpdate={() => handleUpdate(String(product._id))}
              onDelete={() => handleDelete(String(product._id))}
            />
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-3 text-lg">
            No products found. Start adding your first listing!
          </p>
        )}
      </div>
    </div>
  );
}

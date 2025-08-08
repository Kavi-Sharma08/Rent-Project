"use client";

import { useState } from "react";
import { Manrope_Font } from "@/fonts/signupPageFont";
import {IProduct} from  "@/models/Product.model"

interface ProductFormProps {
  postedBy: string; // pass the current logged-in user id to link the product to user
  onSubmit: (product: IProduct) => void;
}

export default function ProductForm({ postedBy, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<IProduct, "postedBy" | "createdAt">>({
    title: "",
    description: "",
    price: 0,
    imageUrl: "",
    type: "buy",
    college: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // minimal validation example: title and price required
    if (!formData.title.trim()) {
      alert("Please enter the product title");
      return;
    }
    if (formData.price <= 0) {
      alert("Price must be a positive number");
      return;
    }

    const product: IProduct = {
      ...formData,
      postedBy: postedBy,
      createdAt: new Date(),
    };

    onSubmit(product);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-xl mx-auto p-6 bg-gray-900 rounded-md shadow-md space-y-5 ${Manrope_Font.className}`}
    >
      <h2 className="text-white text-2xl font-semibold mb-6">Add New Product</h2>

      <div>
        <label htmlFor="title" className="block text-sm text-gray-400 mb-1">
          Product Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter product title"
          className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm text-gray-400 mb-1">
          Description / Condition
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the product condition"
          className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 resize-y"
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm text-gray-400 mb-1">
          Price (₹)
        </label>
        <input
          type="number"
          name="price"
          id="price"
          value={formData.price}
          onChange={handleChange}
          min={0}
          step={0.01}
          placeholder="Enter price"
          className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700"
          required
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm text-gray-400 mb-1">
          Image URL
        </label>
        <input
          type="file"
          name="imageUrl"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Enter image URL"
          className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm text-gray-400 mb-1">
          Type
        </label>
        <select
          name="type"
          id="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      <div>
        <label htmlFor="college" className="block text-sm text-gray-400 mb-1">
          College Name
        </label>
        <input
          type="text"
          name="college"
          id="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="Enter college name"
          className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm text-gray-400 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          name="phoneNumber"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter phone number"
          className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded-md font-semibold"
      >
        Submit Product
      </button>
    </form>
  );
}

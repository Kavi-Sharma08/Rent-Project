"use client";

import { useEffect, useState } from "react";
import { Manrope_Font } from "@/fonts/signupPageFont";
import {IProduct} from  "@/models/Product.model"
import { useSelector } from "react-redux";
import { RootState } from "@/store/appStore";
import toast , {Toaster} from "react-hot-toast"

export interface IProductForm
extends Omit<IProduct, "imageUrl" | "createdAt"> {
  imageFile?: File | null; // local file before upload
}
interface ProductFormProps {
  postedBy: string; // pass the current logged-in user id to link the product to user
  onSubmit: (product: IProductForm) => void;
}

export default function ProductForm({ postedBy, onSubmit }: ProductFormProps) {
  const currentUser = useSelector((state: RootState) => state.user.updatedProfileOfUser);
  const [formData, setFormData] = useState<IProductForm>({
  title: "Sheet Holder",
  description: "Used in Engineering Mechanics",
  price: 0,
  imageFile: null,
  type: "sell",
  college: "",
  phoneNumber:"",
  postedBy : ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };
  useEffect(()=>{
    if(currentUser){
        setFormData((prev)=>({
            ...prev ,
            college : currentUser?.college || "",
            phoneNumber : currentUser?.phoneNumber || ""


        }))
    }
  },[currentUser])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter the product title");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description of the product is required");
      return;
    }
    if (formData.price <= 0) {
      toast.error("Price must be a positive number");
      return;
    }
    if (!formData.college.trim()) {
      toast.error("College is required");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error("Phone Number is required");
      return;
    }
    

    const product: IProductForm = {
      ...formData,
      postedBy: postedBy,
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
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData((prev) => ({
                ...prev,
                imageFile: file // Store the file itself
              }));
            }
          }}
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

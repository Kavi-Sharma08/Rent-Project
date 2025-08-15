import React from "react";

const Products = ({
  title,
  description,
  price,
  imageUrl,
  onUpdate,
  onDelete,
  showActions = false, // controls update/delete buttons
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Centered top text with font styles */}
      <h2 className="text-white text-2xl font-bold mb-6 text-center font-sans tracking-wide">
        Here are your current products
      </h2>

      {/* Product Card */}
      <div className="bg-gray-900 border border-gray-700 rounded-md shadow-md p-4 flex gap-4">
        {/* Image */}
        <img
          src={imageUrl || "/placeholder.jpg"}
          alt={title}
          className="w-28 h-20 object-cover rounded-md flex-shrink-0"
        />

        {/* Info */}
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            <p className="text-gray-400 text-sm truncate">{description}</p>
          </div>
          <p className="text-white font-bold mt-2">₹ {price}</p>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col justify-between space-y-2">
            <button
              onClick={onUpdate}
              className="bg-yellow-500 text-black text-sm px-3 py-1 rounded hover:bg-yellow-600"
            >
              Update
            </button>
            <button
              onClick={onDelete}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

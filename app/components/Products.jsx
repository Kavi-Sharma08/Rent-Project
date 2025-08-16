import React from "react";

export default function Products({
  title,
  description,
  price,
  imageUrl,
  showActions = false,
  onDelete
}) {
  return (
    <div className="bg-[#1f2937] rounded-xl shadow-lg overflow-hidden flex flex-col hover:scale-[1.02] transition-transform duration-200">
      {/* Image */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-40 object-cover"
      />

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-white font-bold text-lg mb-1 truncate">{title}</h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {description}
          </p>
          <p className="text-white font-semibold text-lg">₹ {price}</p>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium flex-1"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

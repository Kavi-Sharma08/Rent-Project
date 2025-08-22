"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FiSearch, FiFilter, FiPhone, FiHeart } from 'react-icons/fi';
import Products from './Products'; // Your existing component

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  college: string;
  phoneNumber: string;
  postedBy: string;
  type: string;
  createdAt: string;
}

interface SearchFilters {
  search: string;
  college: string;
  maxPrice: string;
  sortBy: string;
}

export default function BrowseProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    college: '',
    maxPrice: '',
    sortBy: 'newest'
  });

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when filters change
  useEffect(() => {
    filterProducts();
  }, [products, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/allProducts`
      );
      console.log(response)
      setProducts(response?.data?.products || []);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // College filter
    if (filters.college) {
      filtered = filtered.filter(product => product.college === filters.college);
    }

    // Price filter
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseInt(filters.maxPrice));
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        toast.success('Removed from favorites');
      } else {
        newFavorites.add(productId);
        toast.success('Added to favorites');
      }
      return newFavorites;
    });
  };

  const handleContactSeller = (phoneNumber: string, productTitle: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
    toast.success(`Calling seller for ${productTitle}`);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      college: '',
      maxPrice: '',
      sortBy: 'newest'
    });
  };

  // Get unique colleges for filter dropdown
  const uniqueColleges = [...new Set(products.map(p => p.college))];

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster />
      
      {/* Header */}
      <div className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white text-center mb-2">
            Browse Products
          </h1>
          <p className="text-gray-300 text-center">
            Discover great deals from students across colleges
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiFilter />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">College</label>
                  <select
                    value={filters.college}
                    onChange={(e) => handleFilterChange('college', e.target.value)}
                    className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500"
                  >
                    <option value="">All Colleges</option>
                    {uniqueColleges.map(college => (
                      <option key={college} value={college}>{college}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Max Price</label>
                  <input
                    type="number"
                    placeholder="Enter max price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading amazing products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Products State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">
              {products.length === 0 ? 
                "No products available yet. Be the first to list something!" :
                "No products match your filters. Try adjusting your search."
              }
            </p>
            {filters.search || filters.college || filters.maxPrice ? (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <EnhancedProductCard
              key={product._id}
              product={product}
              isFavorite={favorites.has(product._id)}
              onToggleFavorite={() => toggleFavorite(product._id)}
              onContact={() => handleContactSeller(product.phoneNumber, product.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced Product Card Component
interface EnhancedProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onContact: () => void;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onContact
}) => {
  return (
    <div className="bg-[#1f2937] rounded-xl shadow-lg overflow-hidden flex flex-col hover:scale-[1.02] transition-transform duration-200 group">
      {/* Image with Overlay Actions */}
      <div className="relative">
        <img
          src={product.imageUrl || '/placeholder-product.jpg'}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-800/70 text-gray-300 hover:bg-red-500 hover:text-white'
          }`}
        >
          <FiHeart className={isFavorite ? 'fill-current' : ''} />
        </button>

        {/* College Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-blue-600/90 text-white px-2 py-1 rounded text-xs">
            {product.college}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-white font-bold text-lg mb-2 truncate group-hover:text-blue-400 transition-colors">
            {product.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <p className="text-white font-semibold text-xl mb-4">₹ {product.price.toLocaleString()}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onContact}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
          >
            <FiPhone size={16} />
            Contact
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

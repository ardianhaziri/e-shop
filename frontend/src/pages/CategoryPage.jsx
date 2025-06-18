import { useEffect, useState, useMemo } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { DollarSign, Search, X } from "lucide-react";

const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];

const CategoryPage = () => {
  const { fetchProductsByCategory, products } = useProductStore();
  const { category } = useParams();
  const [search, setSearch] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory, category]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lower) ||
          product.category?.toLowerCase().includes(lower)
      );
    }
    if (
      selectedPrice &&
      (selectedPrice.min !== 0 || selectedPrice.max !== Infinity)
    ) {
      filtered = filtered.filter(
        (product) =>
          product.price >= selectedPrice.min &&
          product.price < selectedPrice.max
      );
    }
    return filtered;
  }, [products, search, selectedPrice]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950">
      {/* Sidebar */}
      <aside className="w-72 p-8 hidden md:block">
        <div className="bg-gray-800/80 rounded-2xl shadow-2xl border border-gray-700 sticky top-10">
          <h2 className="flex items-center gap-2 text-emerald-300 font-bold text-xl mb-6 pt-6 px-6">
            <DollarSign className="w-5 h-5" />
            Filters
          </h2>
          <div className="mb-10 px-6">
            <h3 className="text-gray-400 text-xs font-semibold uppercase mb-4">Price</h3>
            <ul className="flex flex-col gap-2">
              {priceRanges.map((range) => (
                <li key={range.label}>
                  <button
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition font-medium
                    ${
                      selectedPrice.label === range.label
                        ? "bg-emerald-500 text-white shadow"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }`}
                    onClick={() => setSelectedPrice(range)}
                  >
                    <DollarSign className="w-4 h-4" />
                    {range.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <motion.h1
          className="text-center text-5xl font-extrabold tracking-tight text-emerald-400 drop-shadow-xl mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-xl relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-10 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-emerald-400 focus:outline-none shadow-md transition"
            />
            {!!search && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-400"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {filteredProducts?.length === 0 && (
          <div className="text-center text-gray-400 mt-20 text-xl font-medium">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
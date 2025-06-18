import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { useEffect, useState } from "react";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products, fetchProductsByCategory } = useProductStore();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Try to find from loaded products first
    let found = products.find((p) => p._id === id);
    if (found) {
      setProduct(found);
    } else {
      // Fallback: fetch from API (implement getProductById if needed)
      fetch(`/products/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data.product));
    }
  }, [id, products]);

  if (!product) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950">
      <div className="bg-gray-800 rounded-xl shadow-lg flex flex-col md:flex-row p-8 max-w-3xl w-full">
        <img
          src={product.image}
          alt={product.name}
          className="w-full max-w-xs h-80 object-cover rounded-lg mb-6 md:mb-0 md:mr-8"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-4">{product.name}</h2>
          <p className="text-emerald-400 text-xl mb-4">${product.price}</p>
          <p className="text-gray-300 mb-8">{product.description}</p>
          <button
            onClick={() => addToCart(product)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded transition-colors duration-300 text-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
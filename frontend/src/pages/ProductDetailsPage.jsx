import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineShoppingCart } from "react-icons/ai";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useUserStore();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let found = products.find((p) => p._id === id);
    if (found) {
      setProduct(found);
    } else {
      fetch(`/products/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data.product));
    }
  }, [id, products]);

  if (!product) return <div className="text-white p-8">Loading...</div>;

  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
    addToCart(product);
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950">
      <div className="relative bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col md:flex-row p-10 max-w-4xl w-full animate-fade-in">
        <div className="flex-1 flex items-center justify-center mb-10 md:mb-0 md:mr-10">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-xs h-80 object-cover rounded-xl shadow-xl border-4 border-emerald-800 transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-3 leading-tight tracking-tight">
              {product.name}
            </h2>
            <div className="flex items-center mb-4">
              <span className="text-3xl text-emerald-400 font-bold mr-4">
                ${product.price}
              </span>
            </div>
            <p className="text-gray-300 text-lg mb-4">{product.description}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-2 font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 text-xl mt-2 ${
              inStock
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-red-600 cursor-not-allowed text-white'
            }`}
            disabled={!inStock}
          >
            <AiOutlineShoppingCart className="text-2xl" />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
      <style>
        {`
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(30px);}
          100% { opacity: 1; transform: none;}
        }
        `}
      </style>
    </div>
  );
};

export default ProductDetailsPage;
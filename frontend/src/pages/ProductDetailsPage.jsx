import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineShoppingCart, AiFillStar, AiOutlineStar } from "react-icons/ai";

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

  // Helper for ratings (remove if not using)
  const renderRating = (rating) => {
    if (!rating) return null;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.round(rating)
          ? <AiFillStar key={i} className="text-yellow-400 inline-block" />
          : <AiOutlineStar key={i} className="text-yellow-400 inline-block" />
      );
    }
    return <span className="ml-2">{stars}</span>;
  };

  // Example badge logic (customize/remove as needed)
  const badge = product.isNew
    ? { text: "New", color: "bg-emerald-500" }
    : product.discount
      ? { text: `${product.discount}% OFF`, color: "bg-red-500" }
      : null;

  // Patch: handle add to cart with login check
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
      <div
        className="relative bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col md:flex-row p-10 max-w-4xl w-full animate-fade-in"
        style={{
          boxShadow:
            "0 16px 40px 8px rgba(16, 185, 129, 0.13),0 1.5px 5px 0 rgba(0,0,0,0.12)",
        }}
      >
        {badge && (
          <div className={`absolute top-6 right-6 px-4 py-1 rounded-full text-sm font-bold text-white shadow ${badge.color}`}>
            {badge.text}
          </div>
        )}
        <div className="flex-1 flex items-center justify-center mb-10 md:mb-0 md:mr-10">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-xs h-80 object-cover rounded-xl shadow-xl border-4 border-emerald-800 transition-transform duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #262626 60%, #059669 100%)" }}
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
              {renderRating(product.rating)}
            </div>
            <p className="text-gray-300 text-lg mb-8">{product.description}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 text-xl mt-2"
          >
            <AiOutlineShoppingCart className="text-2xl" />
            Add to Cart
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
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    }
    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }
    addToCart(product);
  };

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <Link to={`/product/${product._id}`}>
        <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
          <img className="object-cover w-full" src={product.image} alt="product image" />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
        </div>
      </Link>
      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">{product.name}</h5>
        <div className="mt-2 mb-2 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">${product.price}</span>
          </p>
        </div>
        <div className="mb-3">
          <span className={`text-xs ${product.stock > 0 ? "text-emerald-400" : "text-red-400"}`}>
            {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
          </span>
        </div>
        <button
          className={`flex items-center justify-center rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-emerald-300 ${
            product.stock > 0
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart size={22} className="mr-2" />
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
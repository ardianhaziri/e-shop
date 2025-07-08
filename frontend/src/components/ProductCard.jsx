import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const inStock = product.stock > 0;

const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			// add to cart
			addToCart(product);
		}
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
        <button
					className={`flex items-center justify-center rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 ${
						inStock
							? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-300'
							: 'bg-red-600 cursor-not-allowed'
					}`}
					onClick={handleAddToCart}
					disabled={!inStock}
				>
					<ShoppingCart size={22} className='mr-2' />
					{inStock ? 'Add to cart' : 'Out of Stock'}
				</button>
      </div>
    </div>
  );
};

export default ProductCard;
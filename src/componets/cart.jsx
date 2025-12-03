import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
} from "../redux/counter/counterSlice.js";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="mt-24 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>

      {cart.length === 0 && (
        <p className="text-center text-gray-500">Your cart is empty</p>
      )}

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row items-center gap-6 border rounded-lg p-4 shadow-sm"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-32 h-32 object-cover rounded-md"
            />

            <div className="flex-1">
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-gray-600">₹{item.price}</p>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => {
                    if (item.quantity > 1) {
                      dispatch(decreaseQuantity(item._id));
                    }
                  }}
                  className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  -
                </button>

                <span className="text-lg font-medium">{item.quantity}</span>

                <button
                  onClick={() => dispatch(addToCart(item))}
                  className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  +
                </button>
              </div>

              <p className="mt-2 font-semibold">
                Subtotal: ₹{item.price * item.quantity}
              </p>
            </div>

            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={() => dispatch(removeFromCart(item._id))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="text-right mt-8">
          <h2 className="text-2xl font-bold">
            Cart Total: <span className="text-green-600">₹{total}</span>
          </h2>

          <div className="flex justify-end gap-3 mt-3">
            <button
              onClick={() => cart.forEach(item => dispatch(removeFromCart(item._id)))}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Clear Cart
            </button>

            <button
              onClick={() => {
                const user = JSON.parse(localStorage.getItem("customerAuth"));
                if (!user || !user._id) {
                  navigate(`/login?next=${encodeURIComponent("/checkout")}`);
                } else {
                  navigate("/checkout");
                }
              }}
              disabled={total === 0}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

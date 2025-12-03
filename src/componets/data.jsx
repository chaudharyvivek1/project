import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/counter/counterSlice.js";

const Data = ({ limit }) => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        // const res = await fetch(" http://10.23.201.165:5000/products");
        if (!res.ok) {
          console.error("Failed to fetch products, status:", res.status);
          setProducts([]);
          return;
        }
        const data = await res.json();
        if (limit) setProducts(data.slice(0, limit));
        else setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
    })();
  }, [limit]);

  const isLoggedIn = () => {
    const role = localStorage.getItem("role");
    const cust = localStorage.getItem("customerAuth");
    return Boolean(role || cust);
  };

  const handleBuy = (e, p) => {
    e.preventDefault();
    e.stopPropagation();

    // Allow guest add-to-cart
    dispatch(addToCart({ ...p, quantity: 1 }));
    alert("Item added to cart! You can login at checkout to save your order.");
  };

  return (
    <div className="grid grid-cols-1 max-w-7xl mx-auto sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {products.map((p) => (
        <div key={p._id} className="border rounded-lg p-4 shadow hover:shadow-lg hover:bg-gray-100 transition">

          <img src={p.img} alt={p.title} className="w-full h-48 object-cover rounded" />

          <h2 className="font-bold mt-3 text-lg">{p.title}</h2>
          <p className="text-green-600 font-semibold">₹{p.price}</p>

          <div className="flex gap-3 mt-3">
            <Link
              to={`/product/${p._id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center flex-1"
            >
              View
            </Link>

            <button
              onClick={(e) => handleBuy(e, p)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Data;

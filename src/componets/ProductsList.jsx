// src/pages/ProductsList.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/counter/counterSlice";

const ProductsList = ({ search = "" }) => {
  const [products, setProducts] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/products");

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        if (mounted) setProducts(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();
    return () => (mounted = false);
  }, []);

  // Add to cart – guest allowed
  const handleAddToCart = (e, p) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(p));
    alert("Item added to cart!");
  };

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.trim().toLowerCase();

    return products.filter((p) => {
      return (
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.dis && p.dis.toLowerCase().includes(q))
      );
    });
  }, [products, search]);

  if (loading) return <p className="text-center">Loading products...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  if (filteredProducts.length === 0)
    return (
      <p className="text-center text-gray-600">
        No products found for "{search}"
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((p) => (
        <div
          key={p._id}
          className="border rounded shadow-sm p-4 bg-white hover:shadow-md transition"
        >
          <Link to={`/product/${p._id}`}>
            <img
              src={p.img}
              alt={p.title}
              className="w-full h-48 object-cover rounded mb-4"
            />

            <h3 className="text-lg font-semibold">{p.title}</h3>

            <p className="text-green-600 font-bold text-xl mt-1">
              ₹{p.price}
            </p>

            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {p.dis}
            </p>
          </Link>

          <button
            onClick={(e) => handleAddToCart(e, p)}
            className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;

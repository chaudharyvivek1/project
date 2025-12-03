import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/counter/counterSlice.js";
import ReviewAdd from "../componets/ReviewAdd.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {

      try {
        console.log("Fetching product with ID:", id);
        const res = await fetch(`http://localhost:5000/products/${id}`);
        console.log("Response status:", res.status);
        if (!res.ok) {
          if (res.status === 404) {
            alert("Product not found");
            navigate("/shop");
            return;
          }
          throw new Error(`Server responded with ${res.status}`);
        }
        const data = await res.json();
        console.log("Received data:", data);
        setProduct(data);
      }
      catch (error) {
        console.error("Error fetching product:", error);
        alert("Error loading product");
      }
    })();
  }, [id, navigate]);

  const isLoggedIn = () => {
    const role = localStorage.getItem("role");
    const cust = localStorage.getItem("customerAuth");
    return Boolean(role || cust);
  };

  // const handleAdd = (item) => {

  //   if (!isLoggedIn()) {
  //     alert("Please login to add items");
  // alert("Item added to cart!");
  //     navigate("/login");
  //     return;
  //   }

  //   dispatch(addToCart(item));
  //   alert("Item added to cart!");
  // };
const handleAdd = (item) => {
  // if (!isLoggedIn()) {
  //   alert("Please login to add items");
  //   navigate("/login");
  //   return;
  // }

  dispatch(addToCart(item)); // send FULL product
  alert("Item added to cart!");
};

  if (!product) return <h1 className="mt-20 text-center">Loading...</h1>;

  const visibleReviews = showAll
    ? product.reviews
    : product.reviews?.slice(0, 4);

  return (
    <div className="p-6 mt-20 max-w-4xl mx-auto rounded shadow">

      <div className="flex gap-4 justify-center overflow-x-auto mt-6">
        {[product.img, product.img1, product.img2, product.img3].map(
          (image, i) =>
            image && (
              <img
                key={i}
                src={image}
                alt={product.title}
                className="w-64 rounded object-cover"
              />
            )
        )}
      </div>

      <h2 className="text-3xl font-bold mt-6">{product.title}</h2>
      <p className="text-lg font-semibold text-green-600">₹{product.price}</p>
      <p className="mt-2">{product.dis}</p>

      <div className="mt-2 space-y-1 text-gray-700">
        <p>Category: {product.category}</p>
        <p>Rating: {product.rating}</p>
        <p>Stock: {product.stock}</p>
        <p>Brand: {product.brand}</p>
        <p>Warranty: {product.warranty}</p>
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 mt-5 rounded hover:bg-blue-600"
        onClick={() => handleAdd(product)}

      >
        Add To Cart
      </button>

      <div className="mt-12 bg-gray-100 p-5 rounded">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {product.reviews?.length > 0 ? (
          <>
            <ul className="space-y-4">
              {visibleReviews.map((rev, i) => (
                <li key={i} className="border p-4 rounded shadow bg-white">
                  <p className="font-semibold">{rev.user}</p>
                  <p>{rev.comment}</p>
                  <p className="text-yellow-600 font-bold">
                    {rev.rating}/5
                  </p>
                </li>
              ))}
            </ul>

            {product.reviews.length > 4 && (
              <button
                className="mt-4 text-blue-600 underline "
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-500">No reviews yet</p>
        )}
      </div>

      <ReviewAdd product={product} setProduct={setProduct} />
    </div>
  );
};

export default ProductDetails;

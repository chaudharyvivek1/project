import { useState } from "react";

const ReviewAdd = ({ product, setProduct }) => {
  const [review, setReview] = useState({
    user: "",
    comment: "",
    rating: ""
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleReviewChange = (e) => {
    setReview({
      ...review,
      [e.target.name]: e.target.value,
    });
  };

  // Validate review
  const validate = () => {
    const newErrors = {};

    if (!review.user.trim()) {
      newErrors.user = "Name is required";
    }

    if (!review.comment.trim()) {
      newErrors.comment = "Comment is required";
    } else if (review.comment.length < 5) {
      newErrors.comment = "Comment must be at least 5 characters";
    }

    if (!review.rating) {
      newErrors.rating = "Rating is required";
    } else if (review.rating < 1 || review.rating > 5) {
      newErrors.rating = "Rating must be between 1 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewSubmit = async () => {
    if (!validate()) return;

    const newReview = {
      user: review.user,
      comment: review.comment,
      rating: Number(review.rating),
    };

    try {
      const prodId = product._id || product.id;

      const res = await fetch(`http://localhost:5000/products/${prodId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviews: [...(product.reviews || []), newReview],
        }),
      });

      if (!res.ok) {
        alert("Failed to add review");
        return;
      }

      const updatedProduct = await res.json();

      setProduct(updatedProduct);

      setReview({ user: "", comment: "", rating: "" });
      alert("✅ Review added successfully!");
    } catch (error) {
      console.error("Review Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="mt-6 p-4 border rounded shadow bg-white">
      <h3 className="text-xl font-bold">Add Your Review</h3>

      <div className="mt-2">
        <input
          type="text"
          name="user"
          placeholder="Your Name"
          value={review.user}
          onChange={handleReviewChange}
          className="border p-2 w-full rounded"
        />
        {errors.user && <p className="text-red-500 text-sm">{errors.user}</p>}
      </div>

      <div className="mt-2">
        <textarea
          name="comment"
          placeholder="Your Comment"
          value={review.comment}
          onChange={handleReviewChange}
          className="border p-2 w-full rounded"
        />
        {errors.comment && <p className="text-red-500 text-sm">{errors.comment}</p>}
      </div>

      <div className="mt-2">
        <input
          type="number"
          name="rating"
          placeholder="Rating (1–5)"
          value={review.rating}
          onChange={handleReviewChange}
          min="1"
          max="5"
          className="border p-2 w-full rounded"
        />
        {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
      </div>

      <button
        className="bg-green-500 text-white px-4 py-2 mt-3 rounded"
        onClick={handleReviewSubmit}
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewAdd;

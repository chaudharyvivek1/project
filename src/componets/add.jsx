import React, { useState } from "react";
import Remove from "./remove.jsx"

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    name: "",
    price: "",
    img: "",
    img1: "",
    img2: "",
    img3: "",
    dis: "",
    category: "",
    rating: "",
    stock: "",
    brand: "",
    warranty: "",
    reviews: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const validate = () => {
    if (!product.title) return " Title is required";
    if (!product.name) return " Owner name is required";

    if (!product.price || isNaN(product.price) || Number(product.price) <= 0)
      return " Price must be a number greater than 0";

    if (!product.img) return " Main image URL is required";

    if (!product.dis || product.dis.length < 10)
      return " Description must be at least 10 characters";

    if (!product.category) return " Category is required";

    if (!product.rating || Number(product.rating) < 1 || Number(product.rating) > 5)
      return " Rating must be between 1 and 5";

    if (!product.stock || isNaN(product.stock) || Number(product.stock) < 0)
      return " Stock must be a valid number (>= 0)";

    if (!product.brand) return " Brand is required";

    if (!product.warranty) return " Warranty is required";

    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validate();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          price: Number(product.price),
          rating: Number(product.rating),
          stock: Number(product.stock),
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Failed to add product:", res.status, err);
        alert("Failed to add product: " + res.status);
        return;
      }

      alert("Product Added");

      setProduct({
        title: "",
        name: "",
        price: "",
        img: "",
        img1: "",
        img2: "",
        img3: "",
        dis: "",
        category: "",
        rating: "",
        stock: "",
        brand: "",
        warranty: "",
        reviews: []
      });

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
    <div className="max-w-3xl mx-auto mt-16 border rounded-xl p-6  bg-slate-100">
  <h2 className="text-2xl font-bold mb-6">Add Product</h2>

  <div className="mb-4">
    <label className="font-semibold">Title</label>
    <input name="title" value={product.title} onChange={handleChange} className="border p-2 w-full mt-1 rounded"/>
  </div>

  <div className="mb-4">
    <label className="font-semibold">Owner Name</label>
    <input name="name" value={product.name} onChange={handleChange} className="border p-2 w-full mt-1 rounded"/>
  </div>

  <div className="mb-4">
    <label className="font-semibold">Price</label>
    <input name="price" value={product.price} onChange={handleChange} className="border p-2 w-full mt-1 rounded"/>  
  </div>

  <div className="mb-4">
    <label className="font-semibold">Main Image URL</label>
    <input name="img" value={product.img} onChange={handleChange} className="border p-2 w-full mt-1 rounded"/>
  </div>

  <div className="mb-4">
    <label className="font-semibold">Image 1 URL</label>
    <input name="img1" value={product.img1} onChange={handleChange} className="border p-2 w-full mt-1 rounded"/>
  </div>

  <div className="mb-4">
    <label className="font-semibold">Image 2 URL</label>
    <input name="img2" value={product.img2} onChange={handleChange} className="border p-2 w-full mt-1 rounded"/>
  </div>

  <div className="mb-4">
    <label className="font-semibold">Image 3 URL</label>
    <input name="img3" value={product.img3} onChange={handleChange} className="border p-2 w-full mt-1 rounded"/>
  </div>

  <div className="mb-4">
    <label className="font-semibold">Description</label>
    <textarea name="dis" value={product.dis} onChange={handleChange} className="border p-2 w-full mt-1 rounded h-24"></textarea>
  </div>

  <div className="mb-4">
    <label className="font-semibold">Category</label>
    <input
      name="category"
      value={product.category}
      onChange={handleChange}
      className="border p-2 w-full mt-1 rounded"
    />
  </div>

  <div className="mb-4">
    <label className="font-semibold">Rating (1–5)</label>
    <input name="rating" value={product.rating} onChange={handleChange} className="border p-2 w-full mt-1 rounded" />
  </div>

  <div className="mb-4">
    <label className="font-semibold">Stock</label>
    <input name="stock" value={product.stock} onChange={handleChange} className="border p-2 w-full mt-1 rounded" />
  </div>

  <div className="mb-4">
    <label className="font-semibold">Brand</label>
    <input name="brand" value={product.brand} onChange={handleChange} className="border p-2 w-full mt-1 rounded" />
  </div>

  <div className="mb-4">
    <label className="font-semibold">Warranty</label>
    <input name="warranty" value={product.warranty} onChange={handleChange} className="border p-2 w-full mt-1 rounded"/>
  </div>

  <button
    className="bg-green-600 text-white px-6 py-2 rounded mt-4"
    onClick={handleSubmit}
  >
    Add Product
  </button>
</div>

     <Remove />
    </>
  );
};

export default AddProduct;

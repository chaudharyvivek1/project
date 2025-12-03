import React, { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";


const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    // Fetch products
    const fetchProducts = async () => {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        const res = await fetch(`http://localhost:5000/products/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            alert("Product Deleted");
            fetchProducts(); // refresh list
        } else {
            alert("Failed to delete");
        }
    };
    const a = useRef(0);
    useEffect(() => {
    a.current = a.current + 1;
});
    console.log("Render count:", a.current);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Product List</h2>

            {products.map((p) => (
                <div key={p._id} className="border p-3 rounded mt-2 flex justify-between overflow-x-auto">
                    <div>
                        <h3 className="font-bold">{p.title}</h3>
                        <p>Price: ₹{p.price}</p>
                        <p>Category: {p.category}</p>
                    </div>

                    <div className="w-1/5 ">
                        <button
                            className="bg-blue-500 text-white px-3 py-1 m-1 rounded"
                            onClick={() => navigate(`/edit/${p._id}`)}
                        >
                            Edit
                        </button>


                        <button
                            className="bg-red-500 text-white px-3 py-1 m-1 rounded"
                            onClick={() => deleteProduct(p._id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;

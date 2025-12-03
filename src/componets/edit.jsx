import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

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
    });
    const labels = {
        title: "Title",
        name: "Owner Name",
        price: "Price",
        img: "Main Image URL",
        img1: "Image 1 URL",
        img2: "Image 2 URL",
        img3: "Image 3 URL",
        dis: "Description",
        category: "Category",
        rating: "Rating (1-5)",
        stock: "Stock",
        brand: "Brand",
        warranty: "Warranty",
    };

    useEffect(() => {
        fetch(`http://localhost:5000/products/${id}`)
            .then((res) => res.json())
            .then((data) => setProduct(data));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const updateProduct = async () => {
        const res = await fetch(`http://localhost:5000/products/${id}`, { 
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });

        if (res.ok) {
            alert("Product Updated Successfully!");
            navigate("/product");
        } else {
            alert("Failed to update product");
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto mt-16 border rounded-md">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

            {Object.keys(product).map((key) => (
                key !== "_id" && (
                    <div key={key} className="mt-3 grid grid-cols-[20%_80%] gap-1 border-solid border-gray-300 border-2 rounded-md p-2">
                        <label className="font-semibold w-auto">{labels[key] || key}</label>
                        <input
                            name={key}
                            value={product[key]}
                            onChange={handleChange}
                            className="border p-2 mt-1 w-full"
                        />
                    </div>
                )
            ))}

            <button
                className="bg-blue-500 text-white px-4 py-2 mt-4"
                onClick={updateProduct}
            >
                Update Product
            </button>
        </div>
    );
};

export default EditProduct;

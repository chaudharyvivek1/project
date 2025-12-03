// src/pages/Shop.jsx
import React, { useState } from "react";
import ProductsList from "./ProductsList";

const Shop = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="mt-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">All Products</h2>

      <div className="max-w-xl mx-auto mb-8">
        <label className="block text-sm font-medium mb-2">Search products</label>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, category, brand..."
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
        />
      </div>

      <ProductsList search={search} />
    </div>
  );
};

export default Shop;

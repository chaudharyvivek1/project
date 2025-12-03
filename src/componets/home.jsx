import React from "react";
import Data from "./Data.jsx";
import Categories from "../more/Category.jsx";
import Newsletter from "../more/Newsletter.jsx";

const Home = () => {
  return (
    <div className="mt-20">

      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl mx-6">

        {/* HERO IMAGE FOR FRUIT SHOP */}
        <img
          src="https://images.pexels.com/photos/6157059/pexels-photo-6157059.jpeg"
          alt="Fresh Fruits Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* TEXT CONTENT */}
        <div className="relative z-10 text-left text-white px-8 max-w-2xl">
          <p className="uppercase tracking-widest text-sm mb-3">
            Fresh & Organic
          </p>

          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Premium Quality Fruits<br />
            Delivered to Your Doorstep
          </h1>

          <button
            className="bg-white text-black px-8 py-3 rounded-full transition hover:bg-gray-200"
            onClick={() => (window.location.href = "/shop")}
          >
            Shop Fresh Fruits
          </button>
        </div>
      </section>

      {/* FRUIT CATEGORIES */}
      <div className="mt-16 mx-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Shop by Category
        </h2>
        <Categories />
      </div>

      {/* FEATURED PRODUCTS */}
      <div className="mt-16 mx-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          Fresh Arrivals
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Handpicked fruits. Daily fresh stock.
        </p>
        <Data limit={6} />
      </div>

      {/* NEWSLETTER */}
      <div className="mt-20 mx-6">
        <h2 className="text-2xl font-bold text-center mb-3">
          Subscribe for Offers
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Get updates on discounts, new fruits, and seasonal offers.
        </p>
        <Newsletter />
      </div>

    </div>
  );
};

export default Home;

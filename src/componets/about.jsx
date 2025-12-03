const About = () => {




  return (
    <div className="p-6 mt-20 max-w-4xl mx-auto text-gray-800">

      <h1 className="text-4xl font-bold mb-6 text-center">
        About Our Fruit Store
      </h1>

      <p className="text-lg leading-8 text-center">
        Welcome to <span className="font-semibold">Fresh Fruit Store</span> —
        where freshness meets quality.  
        We deliver premium, chemical-free fruits directly from farms to your home,
        ensuring every bite is nutritious, juicy, and delicious.
      </p>

      <div className="flex justify-center mt-8">
        <img
          src="https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg"
          alt="Fruit Basket"
          className="rounded-lg shadow-md w-full max-w-md"
        />
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-2">Our Vision</h2>
      <p className="leading-7">
        To become India’s most trusted fruit delivery brand by offering
        farm-fresh fruits with fast delivery, fair pricing, and the best taste
        nature has to offer.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-2">Why Choose Us?</h2>
      <ul className="list-disc list-inside leading-7 space-y-2">
        <li>Fresh fruits directly sourced from farmers</li>
        <li>Affordable pricing without middlemen</li>
        <li>Seasonal & exotic fruit collection</li>
        <li>Fast delivery right to your doorstep</li>    
        <li>No preservatives, chemicals, or wax</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Our Collection</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg",
          "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
          "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg",
          "https://images.pexels.com/photos/594590/pexels-photo-594590.jpeg",
          "https://images.pexels.com/photos/760281/pexels-photo-760281.jpeg",
          "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
        ].map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Fruit"
            className="rounded-lg shadow-sm hover:scale-105 transition"
          />
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-10">
        <a
          href="/shop"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Shop Now
        </a>
      </div>

      <p className="mt-10 text-center text-gray-600">
        Thank you for choosing us.  
        We promise freshness, quality, and happiness in every bite.
      </p>
    </div>
  );
};

export default About;

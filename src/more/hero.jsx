import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Hero = () => {
    const navigate = useNavigate();
  return (
    <div className="mt-20 bg-green-100 text-center py-16 px-6">
      <h1 className="text-4xl font-bold">Fresh Fruits Delivered To Your Home</h1>
      <p className="mt-2 text-lg text-gray-700">
        100% Organic · Farm Fresh · Best Price
      </p>

          <button
      onClick={() => navigate("/shop")}
      className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
    >
      Shop
    </button>

    </div>
  );
};

export default Hero;

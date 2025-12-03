import { useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Navbar from "./componets/navbar.jsx";
import { setUserId } from "./redux/counter/counterSlice.js";
import { AuthContext } from "./componets/AuthContext.jsx";
import Home from "./componets/home.jsx";
import About from "./componets/about.jsx";
import Shop from "./componets/shop.jsx";
import Footer from "./componets/footer.jsx";
import Cart from "./componets/cart.jsx";
import ProductDetails from "./componets/productDetails.jsx";
import Add from "./componets/add.jsx";
import Login from "./componets/login.jsx";
import Signup from "./componets/sineup.jsx";
import Checkout from "./componets/Checkout.jsx";  
import Edit from "./componets/edit.jsx";
import Orders from "./componets/AdminOrders.jsx";
import Oderscustomer from "./componets/myoders.jsx";


import "./index.css";


function App() {
  const dispatch = useDispatch();
  const { authUser } = useContext(AuthContext);

  // Initialize Redux cart userId based on auth state
  useEffect(() => {
    if (authUser?.name) {
      dispatch(setUserId(authUser.name));
    } else {
      dispatch(setUserId("guest"));
    }
  }, [authUser?.name, dispatch]);
  return (
    <>
     <div className="flex flex-col min-h-screen">
      
   <Navbar />

      <div className="flex-grow">
         <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/product" element={<Add />} />
        <Route path="/AdminOrders" element={<Orders />} />
        <Route path="/orders" element={<Oderscustomer />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Routes>
      </div>

           <Footer />

    </div>
     

     


    </>
  );
}

export default App;

import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { setUserId } from "../redux/counter/counterSlice.js";
import { AuthContext } from "./AuthContext.jsx";

const Navbar = () => {
  const { authUser, logoutUser } = useContext(AuthContext);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  // Check admin
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  // Check customer
  const isCustomer = Boolean(authUser && authUser._id);

  // Final login status
  const isLoggedIn = isAdmin || isCustomer;

  // Name
  const userName = isAdmin
    ? "Admin"
    : authUser?.name
    ? authUser.name.charAt(0).toUpperCase() + authUser.name.slice(1)
    : "";

  const handleLogout = () => {
    // Preserve user's cart as guest cart
    if (authUser?.name) {
      const userKey = `cart_${authUser.name}`;
      const userCart = JSON.parse(localStorage.getItem(userKey)) || [];

      if (userCart.length > 0) {
        // Save to guest slot
        localStorage.setItem("cart_guest", JSON.stringify(userCart));
      }
      // Remove user-specific cart
      localStorage.removeItem(userKey);
    }

    // Switch to guest mode and load guest cart
    dispatch(setUserId("guest"));

    // Clear auth
    logoutUser();
    localStorage.removeItem("role");

    // Navigate home
    window.location.replace("/");
  };

  return (
    <div className="bg-gray-200 fixed top-0 w-full z-50 shadow">
      <nav className="flex items-center justify-between p-4">

        {/* LOGO */}
        <div className="flex items-center gap-2 animate-slideFade">
          <span className="text-3xl">🍊</span>
          <h1 className="text-2xl font-bold text-orange-600">Fruit Store</h1>
        </div>

        {/* MOBILE MENU */}
        <button className="text-2xl md:hidden" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <ul
          className={`
            md:flex md:static absolute left-0 w-full md:w-auto
            bg-gray-200 md:bg-transparent p-4 md:p-0 
            transition-all duration-300 
            ${open ? "top-14" : "top-[-400px]"}
          `}
        >
          <li className="mx-3 hover:underline"><Link to="/">Home</Link></li>
          <li className="mx-3 hover:underline"><Link to="/about">About</Link></li>
          <li className="mx-3 hover:underline"><Link to="/shop">Shop</Link></li>
          <li className="mx-3 hover:underline"><Link to="/cart">Cart</Link></li>

          {/* CUSTOMER OPTIONS */}
          {isCustomer && (
            <>
              <li className="mx-3 hover:underline">
                <Link to="/orders">My Orders</Link>
              </li>
              <li className="mx-3 text-sm text-gray-700">
                <span className="font-semibold">👤 {userName}</span>
              </li>
            </>
          )}

          {/* ADMIN OPTIONS */}
          {isAdmin && (
            <>
              <li className="mx-3 hover:underline">
                <Link to="/product">Add Product</Link>
              </li>
              <li className="mx-3 hover:underline">
                <Link to="/AdminOrders">Orders</Link>
              </li>
              <li className="mx-3 font-bold text-blue-700">Admin</li>
            </>
          )}

          {/* LOGIN / SIGNUP */}
          {!isLoggedIn && (
            <>
              <li className="mx-3 hover:underline"><Link to="/login">Login</Link></li>
              <li className="mx-3 hover:underline"><Link to="/signup">Signup</Link></li>
            </>
          )}

          {/* LOGOUT */}
          {isLoggedIn && (
            <li className="mx-3">
              <button onClick={handleLogout} className="text-red-500 hover:underline">
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;

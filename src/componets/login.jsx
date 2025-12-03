import { useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";
import { setUserId } from "../redux/counter/counterSlice.js";

const Login = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const nextParam = new URLSearchParams(window.location.search).get("next") || "/";

  // ⭐ Context function (this makes Navbar auto update)
  const { loginUser } = useContext(AuthContext);
  const dispatch = useDispatch();

  // Load remembered username
  useEffect(() => {
    const savedUser = localStorage.getItem("rememberUser");
    if (savedUser) {
      setUser(savedUser);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user.trim() || !pass.trim()) {
      setError("Please enter username and password");
      return;
    }

    // ----------------- ADMIN LOGIN -----------------
    if (user === "admin" && pass === "admin") {
      localStorage.setItem("role", "admin");

      if (remember) localStorage.setItem("rememberUser", user);
      else localStorage.removeItem("rememberUser");

      setSuccess("Admin logged in!");
      setTimeout(() => window.location.replace("/"), 500);
      return;
    }

    // ----------------- CUSTOMER LOGIN -----------------
    try {
      const res = await fetch("http://localhost:5000/customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user, password: pass }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.msg || "Invalid username or password!");
        return;
      }

      const match = await res.json();

      // ⭐ Context updates auth state → Navbar updates instantly
      loginUser(match);

      // ⭐ Merge guest cart into user cart
      try {
        const guestKey = "cart_guest";
        const userKey = `cart_${match.name}`;

        const guestCart = JSON.parse(localStorage.getItem(guestKey)) || [];
        const userCart = JSON.parse(localStorage.getItem(userKey)) || [];

        const merged = [...userCart];
        guestCart.forEach((g) => {
          const found = merged.find((u) => u._id === g._id);
          if (found) found.quantity += g.quantity || 0;
          else merged.push(g);
        });

        localStorage.setItem(userKey, JSON.stringify(merged));
        localStorage.removeItem(guestKey);

        // Update redux userId to load merged cart automatically
        dispatch(setUserId(match.name));
      } catch (err) {
        console.warn("Cart merge failed:", err);
      }

      if (remember) localStorage.setItem("rememberUser", user);
      else localStorage.removeItem("rememberUser");

      setSuccess("Login successful!");

      setTimeout(() => navigate(nextParam), 300);

    } catch (err) {
      console.log(err);
      setError("Server connection error.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <form
          onSubmit={handleLogin}
          className="max-w-sm mx-auto border p-4 rounded shadow"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          {error && <div className="bg-red-100 text-red-700 p-2 mb-3">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-2 mb-3">{success}</div>}

          {/* Username */}
          <input
            placeholder="Username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="border p-2 w-full rounded"
            autoComplete="username"
          />

          {/* Password */}
          <div className="relative mt-3">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="border p-2 w-full rounded"
              autoComplete="current-password"
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 cursor-pointer text-sm text-gray-600"
            >
              {showPass ? "Hide" : "Show"}
            </span>
          </div>

          {/* Remember me */}
          <label className="flex items-center mt-3 gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            <span className="text-sm">Remember me</span>
          </label>

          {/* Login button */}
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
          >
            Login
          </button>

          <p className="text-center text-blue-600 mt-3 cursor-pointer hover:underline">
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

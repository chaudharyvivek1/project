import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    email: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    if (!form.name || !form.password || !form.confirmPassword) {
      return setError("All fields are required");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      // basic validation
      const emailOk = !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      if (!emailOk) return setError("Please enter a valid email address");

      const checkRes = await fetch(
        `http://localhost:5000/customers?name=${encodeURIComponent(
          form.name.toLowerCase()
        )}`
      );
      if (!checkRes.ok) throw new Error("Failed to verify username");
      const exists = await checkRes.json();

      if (Array.isArray(exists) && exists.length > 0) {
        setLoading(false);
        return setError("Username already exists");
      }

      const res = await fetch("http://localhost:5000/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.toLowerCase(),
          password: form.password,
          phone: form.phone,
          email: form.email,
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.msg || body?.message || "Signup failed");
      }

      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto mt-16 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

      {error && <div className="bg-red-100 p-2 text-red-600">{error}</div>}
      {success && <div className="bg-green-100 p-2 text-green-600">{success}</div>}

      <input
        name="name"
        placeholder="Username"
        className="border p-2 w-full mb-2"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border p-2 w-full mb-2"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        className="border p-2 w-full mb-2"
        value={form.phone}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border p-2 w-full mb-2"
        value={form.password}
        onChange={handleChange}
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        className="border p-2 w-full mb-3"
        value={form.confirmPassword}
        onChange={handleChange}
      />

      <button
        onClick={handleSignup}
        disabled={loading}
        className={`px-4 py-2 w-full rounded ${loading ? 'bg-gray-400 text-gray-800' : 'bg-green-500 text-white'}`}
      >
        {loading ? 'Signing up...' : 'Signup'}
      </button>
    </div>
  );
};

export default Signup;

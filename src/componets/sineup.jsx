import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// VITE environment variable
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const abortRef = useRef(null);
  const nameRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const focusFirstInvalid = (field) => {
    if (field === "name" && nameRef.current) nameRef.current.focus();
    if (field === "password" && passwordRef.current) passwordRef.current.focus();
  };

  const validate = () => {
    const { name, password, confirmPassword, email, phone } = form;

    if (!name.trim() || !password.trim() || !confirmPassword.trim()) {
      focusFirstInvalid(!name.trim() ? "name" : "password");
      return "Username, password, and confirm password are required.";
    }

    if (password !== confirmPassword) {
      focusFirstInvalid("password");
      return "Passwords do not match.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }

    if (phone.trim() && !/^\+?\d{7,15}$/.test(phone)) {
      return "Enter a valid phone number.";
    }

    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) return setError(validationError);

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setLoading(true);

    try {
      // Case-insensitive username check
      const checkRes = await fetch(
        `${API_BASE}/customers?name_like=${encodeURIComponent(
          form.name.trim().toLowerCase()
        )}`,
        { signal }
      );

      if (!checkRes.ok) throw new Error("Failed to verify username.");

      const exists = await checkRes.json();

      // Check if exact username exists ignoring case
      const exactMatch = exists.some(
        (u) => u.name.toLowerCase() === form.name.trim().toLowerCase()
      );

      if (exactMatch) {
        setLoading(false);
        return setError("Username already exists.");
      }

      const res = await fetch(`${API_BASE}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal,
        body: JSON.stringify({
          name: form.name.trim().toLowerCase(),
          password: form.password,
          phone: form.phone.trim(),
          email: form.email.trim(),
        }),
      });

      let body;
      const type = res.headers.get("content-type") || "";

      if (type.includes("application/json")) {
        body = await res.json();
      } else {
        body = { message: await res.text() };
      }

      if (!res.ok) {
        throw new Error(body?.message || "Signup failed.");
      }

      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto mt-16 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

      {error && <div className="bg-red-100 p-2 mb-2 text-red-600">{error}</div>}
      {success && <div className="bg-green-100 p-2 mb-2 text-green-600">{success}</div>}

      <form onSubmit={handleSignup} noValidate>
        <label className="block mb-1">Username</label>
        <input
          name="name"
          ref={nameRef}
          placeholder="Username"
          className="border p-2 w-full mb-2"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          value={form.email}
          onChange={handleChange}
        />

        <label className="block mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          className="border p-2 w-full mb-2"
          value={form.phone}
          onChange={handleChange}
        />

        <label className="block mb-1">Password</label>
        <input
          type="password"
          name="password"
          ref={passwordRef}
          placeholder="Password"
          className="border p-2 w-full mb-2"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label className="block mb-1">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="border p-2 w-full mb-3"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 w-full rounded ${
            loading ? "bg-gray-400" : "bg-green-500 text-white"
          }`}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default Signup;

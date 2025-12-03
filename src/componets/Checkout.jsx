// Checkout.jsx
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/counter/counterSlice.js";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems);

  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const [showModal, setShowModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // suggestions state (OpenStreetMap)
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);

  // Load initial data from backend (per-user) and local form
  useEffect(() => {
    const saved = localStorage.getItem("checkoutForm");
    if (saved) setForm(JSON.parse(saved));

    // load saved addresses from backend for logged-in user
    const user = JSON.parse(localStorage.getItem("customerAuth"));
    // If user not logged in, redirect to login with next to come back to checkout
    if (!user || !user._id) {
      navigate(`/login?next=${encodeURIComponent("/checkout")}`);
      return;
    }
    if (user && user._id) {
      fetchSavedAddressesFromServer(user._id);
    } else {
      // fallback to localStorage (if used before)
      const addressesLs = localStorage.getItem("savedAddresses");
      if (addressesLs) setSavedAddresses(JSON.parse(addressesLs));
    }
  }, []);   

  // auto-save form to localStorage (still ok to keep)
  useEffect(() => {
    localStorage.setItem("checkoutForm", JSON.stringify(form));
  }, [form]);

  // fetch saved addresses from backend
  const fetchSavedAddressesFromServer = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/customers/${userId}/addresses`);
      if (!res.ok) return;
      const data = await res.json();
      setSavedAddresses(data || []);
    } catch (err) {
      console.log("Failed to fetch addresses:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // if user typing in address field, trigger suggestions
    if (e.target.name === "address") {
      const q = e.target.value;
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      if (!q || q.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      searchTimeout.current = setTimeout(() => {
        fetchNominatim(q);
      }, 400);
    }
  };

  // call Nominatim to get suggestions
  const fetchNominatim = async (q) => {
    try {
      const url = `${NOMINATIM_URL}?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
        q
      )}`;
      // Nominatim allows browser requests; keep lightweight
      const res = await fetch(url, {
        headers: {
          "Accept-Language": "en",
        },
      });
      const data = await res.json();
      // map to useful fields
      const mapped = (data || []).map((d) => {
        const addr = d.address || {};
        return {
          display_name: d.display_name,
          address_line: d.display_name,
          city: addr.city || addr.town || addr.village || addr.county || "",
          pincode: addr.postcode || "",
          raw: d,
        };
      });
      setSuggestions(mapped);
      setShowSuggestions(true);
    } catch (err) {
      console.log("Nominatim error", err);
    } finally {
      setIsSearching(false);
    }
  };

  // select suggestion -> fill address, city, pincode
  const applySuggestion = (s) => {
    setForm({
      ...form,
      address: s.address_line || form.address,
      city: s.city || form.city,
      pincode: s.pincode || form.pincode,
    });
    setShowSuggestions(false);
  };

  // Save address to backend (and update local list)
  const saveAddressToServer = async (label = "Home") => {
    const user = JSON.parse(localStorage.getItem("customerAuth"));
    if (!user || !user._id) {
      setError("Please login to save address");
      return;
    }

    // basic validation before saving
    if (!form.address || !form.city || !form.pincode) {
      setError("Address, city and pincode are required to save");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/customers/${user._id}/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
        }),
      });
      if (!res.ok) throw new Error("Failed to save address");

      const data = await res.json();
      // data.addresses is the updated list
      setSavedAddresses(data.addresses || []);
      setSuccess("Address saved to your account");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      console.log("Save address error:", err);
      setError("Failed to save address");
    }
  };

  // Delete address on server
  const deleteAddressOnServer = async (addrId) => {
    const user = JSON.parse(localStorage.getItem("customerAuth"));
    if (!user || !user._id) {
      setError("Please login");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/customers/${user._id}/address/${addrId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      const data = await res.json();
      setSavedAddresses(data.addresses || []);
    } catch (err) {
      console.log("Delete address error:", err);
      setError("Failed to delete address");
    }
  };

  // load address (either from savedAddresses or local)
  const loadAddress = (addr) => {
    setForm({
      ...form,
      name: addr.name || form.name,
      contact: addr.contact || form.contact,
      address: addr.address,
      city: addr.city,
      pincode: addr.pincode,
    });
    setShowModal(false);
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!/^\d{10}$/.test(form.contact.trim())) return "Invalid 10-digit contact";
    if (form.address.trim().length < 10) return "Full address is required";
    if (!form.city.trim()) return "City is required";
    if (!/^\d{6}$/.test(form.pincode.trim())) return "Invalid pincode";
    if (!form.paymentMethod) return "Please select payment method";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) return setError(validationError);
    setError("");

    if (cart.length === 0) return setError("Your cart is empty");

    const user = JSON.parse(localStorage.getItem("customerAuth"));
    if (!user || !user._id) return setError("User not found. Login again.");

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
      userId: user._id,
      userName: user.name,

      name: form.name,
      contact: form.contact,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      paymentMethod: form.paymentMethod,

      items: cart.map((item) => ({
        ...item,
        deliveryAddress: { address: form.address, city: form.city, pincode: form.pincode },
      })),

      totalPrice,
      orderDate: new Date().toISOString(),
      status: "pending",
    };

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Order failed");
      }
      await res.json();
      // Debug: log auth and cart keys before clearing
      try {
        console.log("Before clear: customerAuth=", localStorage.getItem("customerAuth"));
        console.log("Before clear: cart_guest=", localStorage.getItem("cart_guest"));
        const curUser = JSON.parse(localStorage.getItem("customerAuth"));
        if (curUser && curUser.name) console.log(`Before clear: cart_${curUser.name}=`, localStorage.getItem(`cart_${curUser.name}`));
      } catch (e) {
        console.warn("Checkout debug read localStorage failed", e);
      }

      dispatch(clearCart());
      localStorage.removeItem("checkoutForm");

      // Debug: log after clearing to help diagnose unexpected logout
      try {
        console.log("After clear: customerAuth=", localStorage.getItem("customerAuth"));
        console.log("After clear: cart_guest=", localStorage.getItem("cart_guest"));
        const curUser2 = JSON.parse(localStorage.getItem("customerAuth"));
        if (curUser2 && curUser2.name) console.log(`After clear: cart_${curUser2.name}=`, localStorage.getItem(`cart_${curUser2.name}`));
      } catch (e) {
        console.warn("Checkout debug read localStorage failed", e);
      }

      setSuccess("Order placed!");
      // keep user on confirmation briefly before navigating home
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.log("Order error:", err);
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // UI rendering — I kept your CSS / structure unchanged, only added small UI bits:
  return (
    <div className="mt-16 bg-gray-50 shadow p-4">
      <div className="">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

        {success && <div className="bg-green-100 p-3 text-green-700 rounded mb-4 text-center">{success}</div>}
        {error && <div className="bg-red-100 p-3 text-red-700 rounded mb-4">{error}</div>}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Order summary */}
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-bold text-xl mb-3">Order Summary</h2>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <li key={item._id} className="flex justify-between border-b pb-2">
                  <span>{item.title} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xl font-bold">
              Total: ₹{cart.reduce((s, i) => s + i.quantity * i.price, 0)}
            </div>
          </div>

          {/* Delivery + Payment */}
          <div className="bg-white p-6 shadow rounded">
            <button onClick={() => setShowModal(true)} className="w-full mb-3 bg-blue-500 text-white py-2 rounded">
              📍 Saved Addresses ({savedAddresses.length})
            </button>

            <div className="space-y-3 relative">
              <input name="name" value={form.name} onChange={handleChange} className="border p-3 w-full rounded" placeholder="Full Name" />
              <input name="contact" value={form.contact} onChange={handleChange} maxLength="10" className="border p-3 w-full rounded" placeholder="Contact" />

              {/* Address input with suggestions */}
              <div className="relative">
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="border p-3 w-full rounded"
                  placeholder="Address (start typing to see suggestions)"
                  autoComplete="off"
                />

                {/* suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 bg-white border rounded mt-1 max-h-56 overflow-auto">
                    {isSearching && <div className="p-2 text-sm text-gray-500">Searching...</div>}
                    {suggestions.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => applySuggestion(s)}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {s.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input name="city" value={form.city} onChange={handleChange} className="border p-3 w-full rounded" placeholder="City" />
              <input name="pincode" value={form.pincode} onChange={handleChange} maxLength="6" className="border p-3 w-full rounded" placeholder="Pincode" />
            </div>

            <div className="mt-3 flex gap-2">
              <button onClick={() => saveAddressToServer("Home")} className="flex-1 bg-gray-200 py-2 rounded">💾 Save Address</button>
              <button onClick={() => saveAddressToServer("Other")} className="flex-1 bg-gray-200 py-2 rounded">💾 Save as Other</button>
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="font-bold mb-2">Payment Method</h3>
              <label className="flex items-center gap-2"><input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === "cod"} onChange={handleChange} /> Cash on Delivery</label>
              <label className="flex items-center gap-2"><input type="radio" name="paymentMethod" value="upi" checked={form.paymentMethod === "upi"} onChange={handleChange} /> UPI</label>
              <label className="flex items-center gap-2"><input type="radio" name="paymentMethod" value="card" checked={form.paymentMethod === "card"} onChange={handleChange} /> Card</label>
            </div>

            <button onClick={handleSubmit} disabled={loading} className={`w-full py-3 mt-6 rounded text-white font-bold ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}>
              {loading ? "⏳ Placing..." : "✓ Place Order"}
            </button>
          </div>
        </div>

        {/* Saved address modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-6 rounded w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Saved Addresses</h2>

              {savedAddresses.length === 0 ? (
                <p className="text-gray-500">No saved addresses.</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {savedAddresses.map((addr) => (
                    <div key={addr._id || addr.id} className="border p-3 rounded">
                      <p className="font-bold">{addr.label || "Saved"}</p>
                      <p>{addr.address}</p>
                      <p>{addr.city}, {addr.pincode}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => loadAddress(addr)} className="flex-1 bg-blue-500 text-white py-1 rounded">Select</button>
                        <button onClick={() => deleteAddressOnServer(addr._id)} className="flex-1 bg-red-500 text-white py-1 rounded">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => setShowModal(false)} className="mt-4 w-full bg-gray-300 py-2 rounded">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;

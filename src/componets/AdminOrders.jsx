// ================= ADMIN ORDERS - FULL ENHANCED CODE =================
import React, { useEffect, useState } from "react";

const statusSteps = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/orders");
      const data = await res.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.log("Error loading orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Search filter
  useEffect(() => {
    const s = search.toLowerCase();

    const filtered = orders.filter((order) =>
      order.name.toLowerCase().includes(s) ||
      order.userName.toLowerCase().includes(s) ||
      order.contact.toLowerCase().includes(s) ||
      order.address.toLowerCase().includes(s) ||
      order.city.toLowerCase().includes(s) ||
      order.pincode.toLowerCase().includes(s)
    );

    setFilteredOrders(filtered);
  }, [search, orders]);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Status update failed");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      alert("Status update failed");
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-16 p-6 bg-white border rounded">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Order Management</h2>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 border rounded focus:ring-2 focus:ring-blue-500"
        placeholder="Search by name, contact, city, user..."
      />

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-600">No matching orders found.</p>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order._id}
            className="border p-5 rounded mb-8 shadow hover:shadow-lg transition"
          >
            {/* CUSTOMER INFO */}
            <div className="mb-4">
              <h3 className="font-bold text-xl mb-1">Customer Details</h3>
              <p><strong>User:</strong> {order.userName}</p>
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Contact:</strong> {order.contact}</p>
              <p><strong>Address:</strong> {order.address}, {order.city}, {order.pincode}</p>
            </div>

            {/* ITEMS */}
            <div className="mb-4">
              <h3 className="font-bold text-xl mb-1">Items</h3>
              {order.items.map((item, index) => (
                <div key={index} className="ml-3 mb-3 p-2 border rounded bg-gray-50">
                  <p>• <strong>{item.title}</strong> × {item.quantity} (₹{item.price})</p>
                  {item.deliveryAddress && (
                    <p className="ml-4 text-gray-600 text-sm">
                      Deliver to: {item.deliveryAddress.address}, {item.deliveryAddress.city}, {item.deliveryAddress.pincode}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* ORDER TRACKING TIMELINE */}
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h4 className="font-semibold mb-3">Order Tracking</h4>

              <div className="flex items-center justify-between relative">
                {statusSteps.map((step, index) => {
                  const currentIndex = statusSteps.indexOf(order.status);
                  const active = index <= currentIndex;

                  return (
                    <div key={step} className="flex-1 text-center z-10">
                      <div
                        className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold text-white ${active ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                      >
                        {step === "cancelled" && order.status === "cancelled" ? "❌" : active ? "✔" : "•"}
                      </div>
                      <p className={`text-xs mt-1 font-semibold ${active ? "text-green-600" : "text-gray-500"}`}>
                        {step.toUpperCase()}
                      </p>
                    </div>
                  );
                })}

                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300">
                  <div
                    className="h-1 bg-green-500 transition-all duration-700"
                    style={{
                      width:
                        ((statusSteps.indexOf(order.status) + 1) / statusSteps.length) * 100 + "%",
                    }}
                  ></div>
                </div>
              </div>

              {/* STATUS UPDATE */}
              <div className="mt-4 flex items-center gap-2">
                <strong>Update Status:</strong>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border rounded px-2 py-1 bg-blue-100 text-blue-700"
                >
                  {statusSteps.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* CANCEL BUTTON */}
              {order.status === "pending" && (
                <button
                  onClick={() => updateStatus(order._id, "cancelled")}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  ❌ Cancel Order
                </button>
              )}
            </div>

            {/* FOOTER */}
            <div className="mt-4 text-sm text-gray-500">
              <p><strong>Total:</strong> ₹{order.totalPrice}</p>
              <p>Ordered On: {new Date(order.orderDate).toLocaleString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
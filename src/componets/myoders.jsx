import React, { useEffect, useState } from "react";

const statusSteps = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("customerAuth"));
    if (!user) return;

    fetch(`http://localhost:5000/orders/user/${user._id}`)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`http://localhost:5000/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!res.ok) {
        alert("Failed to cancel order");
        return;
      }

      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: "cancelled" } : o)
      );

      alert("Order cancelled successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Error cancelling order");
    }
  };

  return (
    <div className="p-6 max-w-4xl mt-16 mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p>No Orders Found.</p>
      ) : (
        orders.map(order => {
          const currentIndex = statusSteps.indexOf(order.status);

          return (
            <div className="border p-5 rounded mb-6 shadow" key={order._id}>
              <p><strong>Total:</strong> ₹{order.totalPrice}</p>
              {/* ORDER TRACKING TIMELINE */}
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h4 className="font-semibold mb-3">Order Tracking</h4>

                <div className="flex items-center justify-between relative">
                  {statusSteps.map((step, index) => {
                    const active = index <= currentIndex;

                    return (
                      <div key={step} className="flex-1 text-center z-10">
                        <div
                          className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold text-white
                          ${active ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                        >
                          {step === "cancelled" && order.status === "cancelled" ? "❌" : active ? "✔" : "•"}
                        </div>
                        <p className={`text-xs mt-1 font-semibold ${active ? "text-green-600" : "text-gray-500"}`}>
                          {step.toUpperCase()}
                        </p>
                      </div>
                    );
                  })}

                  {/* Progress Bar */}
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300">
                    <div
                      className="h-1 bg-green-500 transition-all duration-700"
                      style={{
                        width:
                          ((currentIndex + 1) / statusSteps.length) * 100 + "%",
                      }}
                    ></div>
                  </div>
                </div>

                {/* STATUS MESSAGE */}
                <div className="mt-4 text-sm text-gray-600">
                  {order.status === "pending" && "🕒 Waiting for confirmation"}
                  {order.status === "confirmed" && "✅ Order confirmed"}
                  {order.status === "shipped" && "🚚 Order is on the way"}
                  {order.status === "delivered" && "📦 Order delivered"}
                  {order.status === "cancelled" && "❌ Order cancelled"}
                </div>

                {/* CANCEL BUTTON */}
                {order.status === "pending" && (
                  <button
                    onClick={() => cancelOrder(order._id)}
                    className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              {/* ITEMS */}
              <h4 className="font-bold mt-4">Items:</h4>
              {order.items.map((i, index) => (
                <p key={index}>• {i.title} x {i.quantity}</p>
              ))}

              <p className="text-sm text-gray-500 mt-2">
                Ordered on: {new Date(order.orderDate).toLocaleString()}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrders;

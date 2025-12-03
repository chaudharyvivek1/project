import mongoose from "mongoose";

mongoose
  .connect("mongodb://localhost:27017/miniProject")
  .then(() => console.log("🟢 Connected"))
  .catch((err) => console.log(err));

const OrderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.model("Order", OrderSchema);

const runFix = async () => {
  const orders = await Order.find();

  for (let order of orders) {
    let updated = false;

    // --- Extract City from Address (2nd last part) ---
    if (!order.city) {
      const parts = order.address.split(",");
      order.city = parts[parts.length - 1]?.trim() || "Unknown City";
      updated = true;
    }

    // --- Extract Pincode (6-digit) from address ---
    if (!order.pincode) {
      const pinMatch = order.address.match(/\b\d{6}\b/);
      order.pincode = pinMatch ? pinMatch[0] : "000000";
      updated = true;
    }

    // --- Add deliveryAddress to each item ---
    order.items = order.items.map((item) => {
      if (!item.deliveryAddress) {
        updated = true;
        return {
          ...item,
          deliveryAddress: {
            address: order.address,
            city: order.city,
            pincode: order.pincode,
          }
        };
      }
      return item;
    });

    if (updated) {
      await order.save();
      console.log("✔ Updated order:", order._id.toString());
    }
  }

  console.log("🎉 All orders fixed!");
  process.exit();
};

runFix();

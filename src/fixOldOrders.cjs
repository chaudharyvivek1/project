// fixOldOrders.cjs
// Run with: node fixOldOrders.cjs

const mongoose = require("mongoose");

const MONGO = "mongodb://localhost:27017/miniProject";

mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("🟢 Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ Mongo connect error:", err);
    process.exit(1);
  });

// Use a very permissive schema so we can load existing docs unchanged
const OrderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.model("Order", OrderSchema);

// Utility: try to extract city & pincode from address string
function extractCityAndPincode(address = "") {
  const out = { city: "", pincode: "" };

  if (!address || typeof address !== "string") return out;

  // Normalize separators
  const parts = address.split(/[,\/]+/).map((p) => p.trim()).filter(Boolean);

  // Try to find 6-digit pincode anywhere
  const pinMatch = address.match(/\b\d{6}\b/);
  if (pinMatch) out.pincode = pinMatch[0];

  // Heuristics for city:
  // - If last part looks like pincode, take second-last as city
  // - Else take last part as city
  if (parts.length >= 2) {
    // last part might be pincode
    const last = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];

    if (/^\d{6}$/.test(last) && secondLast) {
      out.city = secondLast;
      if (!out.pincode) out.pincode = last;
    } else {
      // prefer last part as city if it contains letters
      out.city = last;
    }
  } else if (parts.length === 1) {
    // single part - try extract numbers for pincode, rest as city
    if (!out.pincode) {
      const m = parts[0].match(/(\d{6})/);
      if (m) out.pincode = m[1];
    }
    // fallback: no clear city, leave empty
  }

  // cleanup: make sure string lengths reasonable
  if (out.city && out.city.length > 80) out.city = out.city.slice(0, 80);
  if (!out.city) out.city = "Unknown";
  if (!out.pincode) out.pincode = "000000";

  return out;
}

async function run(dryRun = false) {
  try {
    const orders = await Order.find().lean();
    console.log(`Found ${orders.length} orders to check.`);

    let updatedCount = 0;
    for (const ord of orders) {
      try {
        const id = ord._id?.toString?.() || "<no-id>";
        let updated = false;

        // ensure address exists
        const address = typeof ord.address === "string" ? ord.address.trim() : "";

        // Extract city/pincode heuristically if missing
        if (!ord.city || !ord.city.toString().trim()) {
          const { city } = extractCityAndPincode(address);
          if (city && city !== (ord.city || "")) {
            ord.city = city;
            updated = true;
          }
        }

        if (!ord.pincode || !ord.pincode.toString().trim()) {
          const { pincode } = extractCityAndPincode(address);
          if (pincode && pincode !== (ord.pincode || "")) {
            ord.pincode = pincode;
            updated = true;
          }
        }

        // Ensure items array exists
        const items = Array.isArray(ord.items) ? ord.items : [];

        const newItems = items.map((it) => {
          // if deliveryAddress missing or incomplete, create/fill it
          if (!it.deliveryAddress || !it.deliveryAddress.address) {
            updated = true;
            return {
              ...it,
              deliveryAddress: {
                address: address || (it.deliveryAddress && it.deliveryAddress.address) || "",
                city: ord.city || (it.deliveryAddress && it.deliveryAddress.city) || "Unknown",
                pincode: ord.pincode || (it.deliveryAddress && it.deliveryAddress.pincode) || "000000",
              },
            };
          }
          return it;
        });

        // If no items field existed, keep original shape but add items if necessary
        if (items.length === 0 && Array.isArray(ord.items) === false) {
          // leave as is (do not invent items)
        }

        // If anything changed -> save (or show in dry-run)
        if (updated) {
          if (dryRun) {
            console.log(`[DRY-RUN] Would update order ${id}: city="${ord.city}", pincode="${ord.pincode}", itemsAdjusted=${items.length > 0}`);
            updatedCount++;
          } else {
            // Use findByIdAndUpdate to update only changed fields
            await Order.findByIdAndUpdate(id, {
              $set: {
                city: ord.city,
                pincode: ord.pincode,
                items: newItems,
              },
            });
            console.log(`✔ Updated order ${id}`);
            updatedCount++;
          }
        }
      } catch (orderErr) {
        console.error("Error processing order:", orderErr);
      }
    }

    console.log(`Done. Orders updated: ${updatedCount}`);
  } catch (err) {
    console.error("Script failed:", err);
  } finally {
    mongoose.disconnect();
  }
}

const apply = process.argv.includes("--apply");
console.log(`Starting fixOldOrders (apply changes = ${apply})`);
run(!apply).then(() => {
  if (!apply) {
    console.log("\nDry-run finished. No DB changes were made.");
    console.log("To apply changes, re-run: node fixOldOrders.cjs --apply");
  }
});

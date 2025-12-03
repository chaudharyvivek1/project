import mongoose from "mongoose";
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const products = JSON.parse(await readFile(resolve(__dirname, './data/data.json')));

mongoose
  .connect("mongodb://localhost:27017/miniProject")
  .then(() => console.log("✅ DB connected"))
  .catch((e) => console.log("❌", e));

const ProductSchema = new mongoose.Schema({
  title: String,
  name: String,
  price: Number,
  img: String,
  img1: String,
  img2: String,
  img3: String,
  dis: String,
  category: String,
  rating: Number,
  stock: Number,
  brand: String,
  warranty: String,
  reviews: Array,
});

const Product = mongoose.model("Product", ProductSchema);

Product.insertMany(products.users)
  .then(() => {
    console.log("✅ Imported");
    mongoose.disconnect();
  })
  .catch((err) => console.log("❌ Error", err));

const Categories = () => {
const list = [
  {
    name: "Apples",
    img: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg",
  },
  {
    name: "Bananas",
    img: "https://images.pexels.com/photos/2254063/pexels-photo-2254063.jpeg",
  },
  {
    name: "Citrus",
    img: "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg",
  },
  {
    name: "Grapes",
    img: "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg",
  },
];

  return (
    <div className="mt-10 px-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {list.map((c, i) => (
          <div key={i} className="border hover:bg-gray-200 hover:shadow-gray-400 rounded-lg overflow-hidden text-center">
            <img src={c.img} className="h-32 w-full object-cover" />
            <p className="p-2 font-semibold">{c.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Categories;
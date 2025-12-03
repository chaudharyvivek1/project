const Newsletter = () => {
  return (
    <div className="text-center py-10 bg-green-50 mt-10">
      <h2 className="text-2xl font-bold">Subscribe for Updates</h2>
      <p className="text-gray-600 mt-2">Get offers & news.</p>

      <div className="mt-4 flex justify-center gap-2">
        <input
          placeholder="Email"
          className="border px-4 py-2 rounded-lg"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Newsletter;

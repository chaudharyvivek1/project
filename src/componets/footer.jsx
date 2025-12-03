const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white bottom-0 w-full text-center py-4 mt-10">
      <p className="text-sm">
        © {new Date().getFullYear()} pushpa Store · All Rights Reserved
      </p>
      
      <p className="mt-2 text-xs">
        Designed & Developed by <span className="font-semibold">Vivek</span>
      </p>
    </footer>
  );
};

export default Footer;

import { FaGithub, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-tr from-gray-900 via-gray-800 to-emerald-900 py-7 px-4 mt-12 text-white shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-emerald-400 tracking-wide">e-Shop</span>
          <span className="hidden md:inline text-gray-400 text-sm font-normal ml-4">Your one-stop shop for everything cool.</span>
        </div>
        <div className="flex space-x-4 my-3 md:my-0">
          <a href="https://github.com/ardianhaziri/e-shop" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
            <FaGithub size={22} />
          </a>
          <a href="#" className="hover:text-emerald-400 transition-colors">
            <FaInstagram size={22} />
          </a>
          <a href="#" className="hover:text-emerald-400 transition-colors">
            <FaTwitter size={22} />
          </a>
          <a href="#" className="hover:text-emerald-400 transition-colors">
            <FaFacebook size={22} />
          </a>
        </div>
        <div className="text-xs text-gray-400 text-center md:text-right">
          &copy; {new Date().getFullYear()} e-Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
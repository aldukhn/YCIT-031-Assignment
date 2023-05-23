import Link from "next/link";
import "tailwindcss/tailwind.css";

const Navbar = ({ username }) => {
  return (
    <nav>
      {username ? (
        <>
          <a
            href="/api/logout"
            className="w-full px-4 py-2 bg-red-900	 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
          >
            Logout
          </a>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="w-full px-4 py-2 bg-red-900	 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="w-full px-4 py-2 bg-red-900	 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
          >
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;

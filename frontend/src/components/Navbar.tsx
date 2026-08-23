import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      
      {/* Logo / Brand */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          AI Digital SaaS
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <button
          type="button"
          className="text-gray-600 hover:text-gray-900"
        >
          🔔
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



const Sidebar = () => {
    const { role } = useAuth();
    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-6">
            <p className="text-xs text-gray-500 mb-4">
                Role: {role}
            </p>
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900">
                    AI Marketing SaaS
                </h2>
            </div>

            <nav className="space-y-2">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 text-sm font-medium ${isActive
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/team"
                    className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 text-sm font-medium ${isActive
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    Team
                </NavLink>

                <NavLink
                    to="/dashboard/clients"
                    className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 text-sm font-medium ${isActive
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    Clients
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 text-sm font-medium ${isActive
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    Settings
                </NavLink>

            </nav>
        </aside>
    );
};

export default Sidebar;
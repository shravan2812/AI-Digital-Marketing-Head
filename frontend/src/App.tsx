import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Clients from "./pages/Clients";
import CreateClient from "./pages/CreateClient";
import EditClient from "./pages/EditClient";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Protected dashboard routes */}
      <Route element={<ProtectedRoute />}>

        <Route element={<DashboardLayout />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Clients */}
          <Route
            path="/dashboard/clients"
            element={<Clients />}
          />

          <Route
            path="/dashboard/clients/new"
            element={<CreateClient />}
          />

          <Route
            path="/dashboard/clients/:clientId/edit"
            element={<EditClient />}
          />

        </Route>

      </Route>

    </Routes>
  );
}

export default App;
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuctionConsole from "./pages/AuctionConsole";
import Players from "./pages/Players";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auction" element={<AuctionConsole />} />
          <Route path="/players" element={<Players />} />
        </Route>
      </Route>
    </Routes>
  );
}
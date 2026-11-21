import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import AddTeam from "./pages/AddTeam";
import Players from "./pages/Players";
import AuctionConsole from "./pages/AuctionConsole";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/new" element={<AddTeam />} />
          <Route path="/players" element={<Players />} />
          <Route path="/auction" element={<AuctionConsole />} />
        </Route>
      </Route>
    </Routes>
  );
}
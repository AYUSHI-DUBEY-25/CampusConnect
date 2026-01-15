import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Forget from "./pages/Auth/Forget";
import Events from "./pages/Events";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminRoute from "./components/routes/AdminRoute";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateEvents from "./pages/Admin/CreateEvets";
import UpdateEvents from "./pages/Admin/UpdateEvents";
import AdminProfile from "./pages/Admin/AdminProfile";
import AdminEvents from "./pages/Admin/AdminEvents";

import UserDashboard from "./pages/User/Dashboard";
import UserRoute from "./components/routes/UserRoute";
import Profile from "./pages/User/Profile";
import Order from "./pages/User/Order.jsx";

import CartPage from "./pages/CartPage";

function App() {
  return (
    <>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/events" element={<Events />} />

        {/* ADMIN ROUTES */}
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-event" element={<CreateEvents />} />
          <Route path="admin/events" element={<AdminEvents />} />
          <Route path="admin/event/:slug" element={<UpdateEvents />} />
          <Route path="admin/profile" element={<AdminProfile />} />
        </Route>

        {/* USER ROUTES */}
        <Route path="/dashboard" element={<UserRoute />}>
          <Route path="user" element={<UserDashboard />} />
          <Route path="user/profile" element={<Profile />} />
          <Route path="user/orders" element={<Order />} />
        </Route>

        {/* CART */}
        <Route path="/cart" element={<CartPage />} />

      </Routes>
    </>
  );
}

export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Profile from "./pages/user/profile";
import EditProfile from "./pages/user/edit-profile";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/dashboard";
import "react-toastify/dist/ReactToastify.css";
import ManageFarm from "./pages/admin/manage-farm";
import BookingForm from "./pages/bookingform";
// import ManageForm from "./components/salesdashboard";
// import SalesDashBoard from "./components/salesdashboard";
import ManageTrip from "./pages/admin/manage-trip";
import Product from "./pages/product";
import ManageBooking from "./pages/admin/manage-booking";
import Sales from "./pages/staff/sales";
import Payment from "./pages/payment";
import Consulting from "./pages/staff/consulting";
import Delivery from "./pages/staff/delivery";
import Introduce from "./pages/introduce";
import ManageAccounts from "./pages/admin/manage-accounts";
import ManageFeedback from "./pages/admin/manage-feedback";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/edit-profile",
      element: <EditProfile />,
    },
    {
      path: "/bookingform",
      element: (
        <ProtectedRoute allowedRoles={["customer"]}>
          <BookingForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        { path: "farm", element: <ManageFarm /> },
        { path: "trip", element: <ManageTrip /> },
        { path: "booking", element: <ManageBooking /> },
        { path: "account", element: <ManageAccounts /> },
        { path: "feedback", element: <ManageFeedback /> },
      ],
    },
    {
      path: "/product",
      element: <Product />,
    },
    {
      path: "/sales",
      element: (
        <ProtectedRoute allowedRoles={["sales"]}>
          <Sales />
        </ProtectedRoute>
      ),
    },
    {
      path: "/delivery",
      element: (
        <ProtectedRoute allowedRoles={["delivery"]}>
          <Delivery />
        </ProtectedRoute>
      ),
    },
    {
      path: "/payment",
      element: (
        <ProtectedRoute
          allowedRoles={[
            "admin",
            "sales",
            "consulting",
            "delivery",
            "customer",
          ]}
        >
          <Payment />
        </ProtectedRoute>
      ),
    },
    {
      path: "/consulting",
      element: (
        <ProtectedRoute allowedRoles={["consulting"]}>
          <Consulting />
        </ProtectedRoute>
      ),
    },
    {
      path: "/introduce",
      element: <Introduce />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;

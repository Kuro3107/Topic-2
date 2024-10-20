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
// <<<<<<< HEAD
import ManageAccounts from "./pages/admin/manage-accounts";
// =======
import Delivery from "./pages/staff/delivery";
// >>>>>>> c84449d237d4d9277b12f7ddfabacd3be3f6d2aa

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
      element: <BookingForm />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        { path: "farm", element: <ManageFarm /> },
        { path: "trip", element: <ManageTrip /> },
        { path: "booking", element: <ManageBooking /> },
      ],
    },
    {
      path: "/product",
      element: <Product />,
    },
    {
      path: "/sales",
      element: <Sales />,
    },
    {
      path: "/delivery",
      element: <Delivery />,
    },
    {
      path: "/payment",
      element: <Payment />,
    },
    {
      path: "/consulting",
      element: <Consulting />,
    },
    {
      path: "/manage-accounts",
      element: <ManageAccounts />,
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

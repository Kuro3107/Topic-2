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
      children: [{ path: "farm", element: <ManageFarm /> }],
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

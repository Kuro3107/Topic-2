import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <HomePage />,
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "register",
      element: <RegisterPage />,
    },
    //   {
    //     path: "/dashboard",
    //     element: <Dashboard />,
    //     children: [
    //       {
    //         path: "/dashboard/category",
    //         element: <ManageCategory />,
    //       },
    //     ],
    //   },
    //   {
    //     path: "/Profile",
    //     element: <Profile />,
    //   },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

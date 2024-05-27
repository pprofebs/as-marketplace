import { createBrowserRouter, RouterProvider, Route, Routes, Outlet } from "react-router-dom";
import Navbar from "./components/features/Navbar/Navbar";
import Home from "./pages/Home";
import Ad from "./pages/SubmitAd";
import Footer from "./components/features/Footer/Footer";
import AdsPage from "./pages/Products";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignUp";
import ProductDetail from "./pages/ProductDetail";
import RegistrationSuccessPage from "./pages/RegistrationSuccess";
import { UserProvider } from './context/UserContext';


export default function App() {
  const router = createBrowserRouter([
    {
     path : "/",
     Component: Root,
     children: [
        {
          path: "/adj-fel-hirdetest",
          element: <Ad/>
        },
        {
          path: "/termekek",
          element: <AdsPage />
        },
        {
          path: "/regisztracio",
          element: <SignupPage />
        },
        {
          path: "/sikeres-regisztracio",
          element: <RegistrationSuccessPage />
        },
        {
          path: "/belepes",
          element: <LoginPage />
        },
        {
          path: "/termekek/:id",
          element: <ProductDetail />
        },
     ]
    }
  ]);
  return (
    <RouterProvider router={router} />
  );
}

function Root() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/adj-fel-hirdetest" element={<Ad />} />
        <Route path="/termekek" element={<AdsPage/>} />
        <Route path="/termekek/:adId" element={<ProductDetail/>} />
        <Route path="/belepes" element={<LoginPage/>} />
        <Route path="/regisztracio" element={<SignupPage/>} />
        <Route path="/sikeres-regisztracio" element={<RegistrationSuccessPage/>} />
      </Route>
    </Routes>
  )
}

function Layout() {
  return (
    <>
    <UserProvider>
      <Navbar />
      <Outlet />
      <Footer />
    </UserProvider>
    </>
  );
}
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ListingIdPage from "./pages/ListingIdPage.jsx";
import Register from "./pages/Register.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthenticationGuard } from "./AuthGuard.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";
import UpdateListing from "./pages/UpdateListing.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/listing/:listingId",
    element: <ListingIdPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/create_listing",
    element: <AuthenticationGuard component={CreateListing} />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/update_listing",
    element: <AuthenticationGuard component={UpdateListing} />,
  },
  {
    path: "/not-found", // Route for the NotFound component
    element: <NotFound />,
  },
  {
    path: "*", // Catch-all route
    element: <NotFound />, // Render the NotFoundPage component for unmatched routes
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope:
          "create:listing read:messages update:user update:listing delete:listing openid profile email",
        redirect_uri: window.location.origin,
      }}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>
);

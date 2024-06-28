import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import { SignupButton } from "./SignUpButton";

const Header = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="flex">
      <Link to="/" className="btn mr-auto bg-black hover:bg-red-400 text-white">
        Terp-Lease
      </Link>
      {!isAuthenticated ? (
        <div>
          <LoginButton />
          <SignupButton />
        </div>
      ) : (
        <LogoutButton />
      )}
      {isAuthenticated && (
        <Link
          to="/create_listing"
          className="btn ml-2 bg-black hover:bg-red-400 text-white"
        >
          Create Listing
        </Link>
      )}
      {isAuthenticated && (
        <Link
          to="/update_listing"
          className="btn ml-2 bg-black hover:bg-red-400 text-white"
        >
          Update Listing
        </Link>
      )}
      {isAuthenticated && (
        <Link
          to="/profile"
          className="btn ml-2 bg-black hover:bg-red-400 text-white"
        >
          Profile
        </Link>
      )}
    </div>
  );
};

export default Header;

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="btn ml-auto bg-black hover:bg-red-400 text-white">
            Log Out
        </button>
    );
};

export default LogoutButton;
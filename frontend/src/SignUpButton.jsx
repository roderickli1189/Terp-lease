import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const SignupButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <button onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })} className="btn ml-2 bg-black hover:bg-red-400 text-white" >
            Sign Up
        </button>
    );
};
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button onClick={() => loginWithRedirect()} className="btn ml-auto bg-black hover:bg-red-400 text-white">Log In</button>;
};

export default LoginButton;
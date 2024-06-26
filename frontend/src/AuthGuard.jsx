import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import Loading from "./pages/Loading";

export const AuthenticationGuard = ({ component }) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => (
            <Loading loading={true} />
        ),
    });

    return <Component />;
};
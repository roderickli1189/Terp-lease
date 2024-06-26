import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import Header from "../Header";
import ProfileForm from "../forms/ProfileForm";
import React, { useEffect, useState } from "react";

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <Loading loading={isLoading} />
        );
    }

    return (
        isAuthenticated && (
            <div>
                <Header />
                <div>
                    <img src={user.picture} alt={user.name} />
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <p>{user.nickname}</p>
                    <h3>User Metadata</h3>

                    <pre>{JSON.stringify(user, null, 2)}</pre>

                </div>
                <ProfileForm />
            </div>
        )
    );
};

export default Profile;
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import Header from "../Header";
import ProfileForm from "../forms/ProfileForm";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    isAuthenticated && (
      <div>
        <Header />

        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold underline text-2xl pb-2">Profile</h1>

          <div className="card bg-base-100 w-96 shadow-xl m-6">
            <figure>
              <img src={user.picture} alt="profile pic" />
            </figure>
            <div className="card-body">
              <h2>Name: {user.name}</h2>
              <p>Email: {user.email}</p>
              <p>Nickname: {user.nickname}</p>
              <p>{user.sub}</p>
            </div>
          </div>
          <ProfileForm />
        </div>
      </div>
    )
  );
};

export default Profile;

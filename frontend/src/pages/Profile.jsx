import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import Header from "../Header";
import ProfileForm from "../forms/ProfileForm";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();
  const [phone, setPhone] = useState();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPhone();
    }
  }, [user, isLoading]);

  const fetchPhone = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "read:user_phone",
        },
      });
      console.log(accessToken);
      const url = `http://127.0.0.1:5000/get_phone/${String(user.sub)}`;
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await fetch(url, options);

      if (response.status !== 201 && response.status !== 200) {
        const data = await response.json();
        console.log(data);
      } else {
        const data = await response.json();
        setPhone(data.phoneNumber);
        console.log(data.phoneNumber);
      }
    } catch (error) {
      console.error("Error fetching phone number:", error);
    }
  };

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
              <p>Phone number: {phone ? phone : "None"}</p>
            </div>
          </div>
          <ProfileForm />
        </div>
      </div>
    )
  );
};

export default Profile;

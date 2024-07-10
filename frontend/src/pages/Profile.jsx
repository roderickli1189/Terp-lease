import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import Header from "../Header";
import ProfileForm from "../forms/ProfileForm";
import React, { useEffect, useState } from "react";
import { CodeSnippet } from "../CodeSnippet";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();
  const [phone, setPhone] = useState();
  const [phoneLoading, setPhoneLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPhoneIDToken();
    }
  }, [user, isLoading]);

  const fetchPhoneIDToken = async () => {
    try {
      const idToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });
      const decodedToken = jwtDecode(idToken);
      console.log(decodedToken);

      // Extract phoneNumber from the custom namespace in the decoded token
      const namespace = "https://getphoneuser_metadata";
      if (decodedToken[namespace] && decodedToken[namespace].phoneNumber) {
        setPhone(decodedToken[namespace].phoneNumber);
      } else {
        setPhone("None");
      }
    } catch (error) {
      console.error("Error decoding ID token:", error);
    }
  };

  const fetchPhone = async () => {
    try {
      setPhoneLoading(true);
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
    } finally {
      setPhoneLoading(false);
    }
  };

  if (isLoading || phoneLoading) {
    return <Loading loading={isLoading || phoneLoading} />;
  }

  return (
    isAuthenticated && (
      <div>
        <Header />
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-green-500">
              Form submitted successfully!
            </h3>
            <p className="py-4">Press ESC key or click outside to close</p>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
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
          <div className="profile__details">
            <CodeSnippet
              title="Decoded ID Token"
              code={JSON.stringify(user, null, 2)}
            />
          </div>
          <ProfileForm />
        </div>
      </div>
    )
  );
};

export default Profile;

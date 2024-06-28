import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import Header from "../Header";
import React, { useEffect, useState } from "react";
import UpdateListingForm from "../forms/UpdateListingForm";

const UpdateListing = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchListings();
    }
  }, [isAuthenticated, user]);

  const fetchListings = async () => {
    const response = await fetch(
      "http://127.0.0.1:5000/user_listings/" + String(user.sub)
    );
    const data = await response.json();
    setListings(data.listings);
    console.log(data);
  };

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    isAuthenticated && (
      <div>
        <Header />
        <div className="flex justify-center">
          <h1 className="font-bold underline text-2xl pb-2">Update Listings</h1>
        </div>
        <div className="flex flex-col justify-center items-center">
          {listings.map((listing, index) => (
            <div
              key={listing.id}
              className="card bg-base-100 w-96 shadow-xl m-6"
            >
              <div className="card-body flex flex-col items-center">
                <h2 className="card-title">Listing #{index + 1}</h2>
                <p>Apartment: {listing.apartment}</p>
                <p>Layout: {listing.layOut}</p>
                <p>Rent: {listing.rent}</p>
                <div className="card-actions justify-center">
                  <button
                    className="btn"
                    onClick={() =>
                      document.getElementById(`modal_${listing.id}`).showModal()
                    }
                  >
                    Update
                  </button>
                  <dialog id={`modal_${listing.id}`} className="modal">
                    <div className="modal-box w-11/12 max-w-5xl">
                      <UpdateListingForm listing={listing} />
                      <div className="modal-action">
                        <form method="dialog">
                          <button className="btn">Close</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default UpdateListing;

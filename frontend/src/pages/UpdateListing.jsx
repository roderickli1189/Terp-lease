import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import Header from "../Header";
import React, { useEffect, useState } from "react";
import UpdateListingForm from "../forms/UpdateListingForm";

const UpdateListing = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchListings();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const modal = document.getElementById("my_modal_2");

    const handleClose = () => {
      console.log("Modal closed");
      window.location.reload();
      // You can add any other logic you want to execute when the modal closes here
    };

    if (modal) {
      modal.addEventListener("close", handleClose);
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (modal) {
        modal.removeEventListener("close", handleClose);
      }
    };
  }, []);

  const fetchListings = async () => {
    const response = await fetch(
      "http://127.0.0.1:5000/user_listings/" + String(user.sub)
    );
    const data = await response.json();
    setListings(data.listings);
  };

  const handleDelete = async (id) => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "delete:listing",
        },
      });

      const url = "http://127.0.0.1:5000/delete_listing/" + String(id);
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await fetch(url, options);
      if (response.status !== 201 && response.status !== 200) {
        const data = await response.json();
        console.log(data.message);
      } else {
        console.log("works");
        document.getElementById("my_modal_1").close();
        document.getElementById("my_modal_2").showModal();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    isAuthenticated && (
      <div>
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-green-500">
              Delete Success!
            </h3>
            <p className="py-4">Press ESC key or click outside to close</p>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <Header />
        <div className="flex justify-center">
          <h1 className="font-bold underline text-2xl pb-2">Update Listings</h1>
        </div>
        <div className="flex flex-col justify-center items-center">
          {listings.map((listing, index) => (
            <div
              key={listing.id}
              className="card bg-base-100 w-96 shadow-xl m-6 relative"
            >
              <button
                className="btn absolute top-2 right-2 text-red-500 bg-black hover:bg-red-500 hover:text-black" // Position the delete button
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                Delete
              </button>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <p className="py-4">
                    Are you sure you want to delete this listing?
                  </p>
                  <div className="modal-action">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleDelete(listing.id);
                      }}
                    >
                      <button type="submit" className="btn">
                        Yes
                      </button>
                    </form>

                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn">No</button>
                    </form>
                  </div>
                </div>
              </dialog>
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

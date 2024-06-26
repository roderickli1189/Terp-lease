import React from "react";
import { Link } from "react-router-dom";

const ListingList = ({ listings }) => {
  return (
    <div className="w-4/5 grid grid-cols-3 ">
      {listings.map((listing) => (
        <div key={listing.id} className="card border-2 border-red-500 m-6 p-3">
          <div className="card-body items-center">
            <div>Apartment: {listing.apartment}</div>

            <div>Rent: {listing.rent}</div>
            <div>Lay Out: {listing.layOut}</div>

            <Link to={`/listing/${listing.id}`} className="mt-3">
              <span className="btn border-2 border-black hover:bg-black hover:text-white">
                View Listing
              </span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingList;

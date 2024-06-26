import { useParams } from 'react-router-dom'
import Header from '../Header'
import { useAuth0 } from '@auth0/auth0-react'
import Loading from './Loading'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function ListingIdPage() {
    const [listing, setListings] = useState([]);
    const { isLoading } = useAuth0();
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchListingId(params.listingId)
    }, []);

    const fetchListingId = async (listingId) => {
        const getListing = await fetch("http://127.0.0.1:5000/listings/" + String(listingId));
        const data = await getListing.json();

        if (getListing.status !== 404) {
            console.log(data)
            setListings(data);
            setLoading(false)
        }
        else {
            navigate("/not-found");
        }
    };

    if (isLoading || loading) {
        return (
            <Loading loading={isLoading} />
        );
    }
    return (
        <>
            <Header />
            <h1 className="font-bold underline text-2xl pb-2 text-center">Listing</h1>
            <div className="card">
                <div className="card-body items-center">
                    <div>Apartment: {listing.apartment}</div>
                    <div>Rent: {listing.rent}</div>
                    <div>Lay Out: {listing.layOut}</div>
                    <div>Start Date: {new Date(listing.startDate).toLocaleDateString()}</div>
                    <div>End Date: {new Date(listing.endDate).toLocaleDateString()}</div>
                    <div>Semester: {listing.semester ? listing.semester : "Semester not specified"}</div>
                    <div>Roommate Gender: {listing.gender ? listing.gender : "Gender not specified"}</div>
                    <div>Description: {listing.description ? listing.description : "No description available"}</div>
                    <div>Posting Date: {new Date(listing.postDate).toLocaleDateString()}</div>
                    {listing.images && listing.images.length > 0 &&
                        (<div className="w-96 h-96 overflow-hidden">
                            <div className="carousel w-full">
                                {listing.images && listing.images.map((image, index) => (
                                    <div key={index} id={`item${index + 1}`} className="carousel-item w-full">
                                        <img src={image} alt={`Image ${index}`} className="w-full" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center w-full py-2 gap-2">
                                {listing.images && listing.images.map((image, index) => (
                                    <a key={index} href={`#item${index + 1}`} className="btn btn-xs">{index + 1}</a>
                                ))}
                            </div>
                        </div>)}

                    {listing.user && (
                        <div className="card w-96 bg-base-100 shadow-xl">
                            <figure><img src={listing.user.picture} alt={listing.user.name} className="rounded" /></figure>
                            <div className="card-body">
                                <h2 className="card-title">Original Poster</h2>
                                <p>Name: {listing.user.name}</p>
                                <p>Email: {listing.user.email}</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary">Message Now</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ListingIdPage

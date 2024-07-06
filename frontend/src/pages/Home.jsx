import { useState, useEffect } from "react";
import ListingList from "../ListingList";
import Header from "../Header";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import SortBar from "../SortBar";

function Home() {
  const [listings, setListings] = useState([]);
  const [sortedListings, setSortedListings] = useState([]);
  const { isLoading, isAuthenticated, user } = useAuth0();

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      createUser();
    }
  }, [user]);

  const setSortOption = (sortOption) => {
    let sorted = [...listings];
    if (sortOption === "newest") {
      sorted.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    } else if (sortOption === "oldest") {
      sorted.sort((a, b) => new Date(a.postDate) - new Date(b.postDate));
    }
    setListings(sorted);
  };

  const fetchListings = async () => {
    const response = await fetch("http://127.0.0.1:5000/listings");
    const data = await response.json();
    setListings(data.listings);
    setSortedListings(data);
  };

  const createUser = async () => {
    const data = {
      name: user.name,
      sub: user.sub,
      email: user.email,
      picture: user.picture,
      nickname: user.nickname,
      phoneNumber: user.phone_number,
    };
    const url = "http://127.0.0.1:5000/create_account";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    if (response.status !== 201) {
      const data = await response.json();
      console.log(data.message);
    } else {
      console.log("user created");
    }
  };

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }
  return (
    <>
      <Header />
      <div className="flex justify-center">
        <h1 className="font-bold underline text-2xl pb-2">Listings</h1>
      </div>
      <div className="flex">
        <SortBar setSortOption={setSortOption} />
        <ListingList listings={listings} />
      </div>
    </>
  );
}

export default Home;

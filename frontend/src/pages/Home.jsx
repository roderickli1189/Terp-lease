import { useState, useEffect } from "react";
import ListingList from "../ListingList";
import Header from "../Header";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import SortBar from "../SortBar";

function Home() {
  const [listings, setListings] = useState([]);
  const [listingsCopy, setListingsCopy] = useState([]);
  const { isLoading, isAuthenticated, user } = useAuth0();

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      createUser();
    }
  }, [user]);

  const refresh = () => {
    setListings(listingsCopy);
  };
  const setSortOption = (sortOption) => {
    let sorted = [...listingsCopy];

    if (sortOption.aptOption.length > 0) {
      let temp = [];
      sorted.forEach((item) => {
        if (sortOption.aptOption.includes(item["apartment"])) {
          temp.push(item);
        }
      });
      sorted = temp;
    }
    console.log(sorted);
    if (sortOption.layOutOption.length > 0) {
      let temp = [];
      sorted.forEach((item) => {
        if (sortOption.layOutOption.includes(item["layOut"])) {
          temp.push(item);
        }
      });
      sorted = temp;
    }
    console.log(sorted);
    if (sortOption.minRent !== "" || sortOption.maxRent !== "") {
      const min = sortOption.minRent !== "" ? parseInt(sortOption.minRent) : 0;
      const max =
        sortOption.maxRent !== "" ? parseInt(sortOption.maxRent) : 5000;

      console.log(min);
      console.log(max);
      let temp = [];
      sorted.forEach((item) => {
        if (min <= item["rent"] && item["rent"] <= max) {
          temp.push(item);
        }
      });
      sorted = temp;
    }
    console.log(sorted);
    if (sortOption.dateOption !== null) {
      if (sortOption.dateOption === "newest") {
        sorted.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
      } else if (sortOption.dateOption === "oldest") {
        sorted.sort((a, b) => new Date(a.postDate) - new Date(b.postDate));
      }
    }
    setListings(sorted);
  };

  const fetchListings = async () => {
    const response = await fetch("http://127.0.0.1:5000/listings");
    const data = await response.json();
    setListings(data.listings);
    setListingsCopy(data.listings);
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
      <div className="flex w-full">
        <SortBar setSortOption={setSortOption} refresh={refresh} />
        <div className="w-full">
          <ListingList listings={listings} />
        </div>
      </div>
    </>
  );
}
/*
<div className="flex w-full">
      <SortBar setSortOption={setSortOption} />
      <div className="w-full">
        <ListingList listings={listings} />
      </div>
    </div> 
*/
export default Home;

import Header from "../Header"
import ListingForm from "../forms/ListingForm"

function CreateListing() {
    return <>
        <Header />
        <h1 className="flex justify-center font-bold underline text-2xl pb-2">Create Listing</h1>
        <ListingForm />
    </>
}

export default CreateListing
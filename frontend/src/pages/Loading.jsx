import ScaleLoader from "react-spinners/ScaleLoader";

const Loading = ({ loading }) => {

    return <div className="flex flex-col items-center">
        <ScaleLoader
            color="red"
            loading={loading}
            size={300}
        />
        {loading && <p>Loading...</p>}
    </div>
}

export default Loading
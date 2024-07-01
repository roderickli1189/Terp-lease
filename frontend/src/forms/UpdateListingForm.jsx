import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth0 } from "@auth0/auth0-react";

const rent_schema = z
  .string()
  .min(1, { message: "Rent is required" })
  .refine(
    (val) => {
      const rentInt = parseInt(val);
      return rentInt >= 0 && rentInt <= 5000;
    },
    { message: "rent is not within valid range 0-5000" }
  );

const MAX_FILE_SIZE = 1048576;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const schema = z
  .object({
    apartment: z.string().min(1, { message: "Apartment is required" }),
    rent: rent_schema,
    layOut: z.string().min(1, { message: "Lay Out is required" }),
    gender: z.string().optional(),
    semester: z.string().optional(),
    start_date: z.string().min(1, { message: "start date is required" }),
    end_date: z.string().min(1, { message: "end date is required" }),
    description: z.string().optional(),
    files: z
      .instanceof(FileList)
      .refine((files) => files?.length < 4, "can only upload 3 or less")
      .refine((files) => {
        return Object.values(files).every(
          (file) => file?.size <= MAX_FILE_SIZE
        );
      }, `Max file size is 1MB.`)
      .refine((files) => {
        return Object.values(files).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file?.type)
        );
      }, ".jpg, .jpeg, .png and .webp files are accepted."),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      return endDate <= startDate ? false : true;
    },
    {
      message: "end date must be after start date",
      path: ["end_date"],
    }
  );

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  // Format the date as "year-mon-day"
  return `${year}-${month}-${day}`;
}
const UpdateListingForm = ({ listing }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      apartment: listing.apartment,
      rent: listing.rent.toString(),
      layOut: listing.layOut,
      gender: listing.gender,
      semester: listing.semester,
      start_date: formatDate(listing.startDate),
      end_date: formatDate(listing.endDate),
      description: listing.description,
    },
  });
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const convertFilesToBase64 = (filesObject) => {
    return Promise.all(
      Object.values(filesObject).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );
  };

  const onSubmit = async (data) => {
    const fileBase64 = await convertFilesToBase64(data.files);
    const payload = {
      ...data,
      images: fileBase64,
      id: listing.id,
    };
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "update:listing",
        },
      });

      const url = "http://127.0.0.1:5000/update_listing";
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      };
      const response = await fetch(url, options);
      if (response.status !== 201 && response.status !== 200) {
        const data = await response.json();
        setError("formError", {
          message: data.message,
        });
      } else {
        document.getElementById("my_modal_2").showModal();
        reset();
        console.log("works");
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
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
      <div className="container mx-auto max-w-4xl">
        <form
          className="flex flex-col border-2 border-black rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-2 p-1 rounded-lg">
            <label htmlFor="apartment" className="block mb-1">
              Apartment:
            </label>
            <select
              id="apartment"
              className="select select-bordered w-full max-w-xs"
              {...register("apartment")}
              defaultValue=""
            >
              <option disabled value=""></option>
              <option value="Tempo">Tempo</option>
              <option value="University View">University View</option>
              <option value="Varsity">Varsity</option>
              <option value="Parkside">Parkside</option>
              <option value="Landmark">Landmark</option>
              <option value="Union on Knox">Union on Knox</option>
              <option value="Standard">Standard</option>
              <option value="Aster">Aster</option>
              <option value="Terripan Row">Terripan Row</option>
              <option value="Aspen">Aspen</option>
              <option value="Hub">Hub</option>
              <option value="Domain">Domain</option>
              <option value="Other">Other</option>
            </select>
            {errors.apartment && (
              <div className="text-red-500">{errors.apartment.message}</div>
            )}
          </div>
          <div className="mb-2 p-1 rounded-lg">
            <label htmlFor="rent" className="block mb-1">
              Rent:
            </label>
            <input
              {...register("rent")}
              type="number"
              id="rent"
              className="px-4 py-2 border rounded-lg w-full"
            />
            {errors.rent && (
              <p className="text-red-500">{errors.rent.message}</p>
            )}
          </div>
          <div className="mb-2 p-1 rounded-lg">
            <label htmlFor="layOut" className="block mb-1">
              Lay Out:
            </label>
            <select
              id="layOut"
              className="select select-bordered w-full max-w-xs"
              {...register("layOut")}
              defaultValue=""
            >
              <option disabled value=""></option>
              <option value="1 bed 1 bath">1 bed 1 bath</option>
              <option value="2 bed 2 bath">2 bed 2 bath</option>
              <option value="2 bed 1 bath">2 bed 1 bath</option>
              <option value="3 bed 3 bath">3 bed 3 bath</option>
              <option value="4 bed 4 bath">4 bed 4 bath</option>
              <option value="4 bed 2 bath">4 bed 2 bath</option>
              <option value="5 bed 5 bath">5 bed 5 bath</option>
            </select>
            {errors.layOut && (
              <p className="text-red-500">{errors.layOut.message}</p>
            )}
          </div>
          <div className="mb-2 p-1 rounded-lg">
            <label htmlFor="gender" className="block mb-1">
              Roommate Genders (optional):
            </label>
            <select
              id="gender"
              className="select select-bordered w-full max-w-xs"
              {...register("gender")}
              defaultValue=""
            >
              <option disabled value=""></option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Coed">Coed</option>
            </select>
            {errors.roommate && (
              <p className="text-red-500">{errors.roommate.message}</p>
            )}
          </div>
          <div className="mb-2 p-1 rounded-lg">
            <label htmlFor="semester" className="block mb-1">
              Lease Semester (optional):
            </label>
            <select
              id="semester"
              className="select select-bordered w-full max-w-xs"
              {...register("semester")}
              defaultValue=""
            >
              <option disabled value=""></option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
            </select>
            {errors.semester && (
              <p className="text-red-500">{errors.semester.message}</p>
            )}
          </div>
          <div className="mb-2 p-1 rounded-lg">
            <label htmlFor="start_date" className="block mb-1">
              Lease Start Date:
            </label>
            <input
              {...register("start_date")}
              type="date"
              id="start_date"
              className="px-4 py-2 border rounded-lg w-full"
            />
            {errors.start_date && (
              <p className="text-red-500">{errors.start_date.message}</p>
            )}
          </div>
          <div className="mb-2 p-1 rounded-lg">
            <label htmlFor="end_date" className="block mb-1">
              Lease End Date:
            </label>
            <input
              {...register("end_date")}
              type="date"
              id="end_date"
              className="px-4 py-2 border rounded-lg w-full"
            />
            {errors.end_date && (
              <p className="text-red-500">{errors.end_date.message}</p>
            )}
          </div>
          <div className="mb-2 p-1 rounded-lg">
            <label htmlFor="description" className="block mb-1">
              Description (optional):
            </label>
            <textarea
              {...register("description")}
              id="description"
              placeholder="Description"
              className="textarea textarea-bordered px-4 py-2 border rounded-lg w-full"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="mb-2 p-1 rounded-lg">
            <label
              htmlFor="files"
              className="form-control w-full max-w-xs block mb-1"
            >
              <div className="label">
                <span className="label-text">Pick files</span>
                <span className="label-text-alt">
                  clt+click to select multiple:
                </span>
              </div>
            </label>
            <input
              type="file"
              id="files"
              {...register("files")} // register the file input
              multiple="multiple/"
              className="file-input file-input-bordered w-full max-w-xs"
              onChange={handleFileChange}
            />
            <p className="label-text">Selected Files:</p>
            {
              <div>
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li className="label-text-alt" key={index}>
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            }
            {errors.files && (
              <p className="text-red-500">{errors.files.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="border-2 border-black rounded-full p-2"
          >
            Submit
          </button>
          {errors.formError && (
            <p className="text-red-500">{errors.formError.message}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default UpdateListingForm;

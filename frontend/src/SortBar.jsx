import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const schema = z
  .object({
    dateOption: z.string().nullish(),
    aptOption: z.array(z.string()),
    layOutOption: z.array(z.string()),
    minRent: z.string().optional(),
    maxRent: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.minRent !== "" && data.maxRent !== "") {
        const intMinRent = parseInt(data.minRent);
        const intMaxRent = parseInt(data.maxRent);
        if (intMinRent >= intMaxRent) {
          return false;
        }
      }
      return true;
    },
    {
      message: "min rent must be strictly less than max rent",
      path: ["minRent"],
    }
  );

const SortBar = ({ setSortOption, refresh }) => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      dateOption: null,
      aptOption: [],
      layOutOption: [],
      minRent: "",
      maxRent: "",
    },
  });

  const apartmentNames = [
    "Tempo",
    "University View",
    "Varsity",
    "Parkside",
    "Landmark",
    "Union on Knox",
    "Standard",
    "Aster",
    "Terripan Row",
    "Aspen",
    "Hub",
    "Domain",
    "Other",
  ];

  const layOutTypes = [
    "1 bed 1 bath",
    "2 bed 2 bath",
    "2 bed 1 bath",
    "3 bed 3 bath",
    "4 bed 4 bath",
    "4 bed 2 bath",
    "5 bed 5 bath",
  ];

  const [selectedDateOption, setSelectedDateOption] = useState(null);

  const onSubmit = async (data) => {
    console.log(data);
    setSortOption(data);
  };

  const handleRadioClick = (value) => {
    setSelectedDateOption((selectedDateOption) => {
      const newVal = selectedDateOption === value ? null : value;
      setValue("dateOption", newVal);
      return newVal;
    });
  };
  const handleReset = () => {
    reset();
    setSelectedDateOption(null);
    refresh();
  };
  return (
    <div className="flex flex-col items-center justify-start w-1/5 border-r-2 border-red-500 mx-2 pr-6">
      <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full">
        <h1 className="underline items-center">Filter Options</h1>
        <h2 className="underline">Date:</h2>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Newest</span>
            <input
              type="radio"
              value="newest"
              {...register("dateOption")}
              className="radio"
              onClick={() => handleRadioClick("newest")}
              checked={selectedDateOption === "newest"}
            />
          </label>

          <label className="label cursor-pointer">
            <span className="label-text">Oldest</span>
            <input
              type="radio"
              value="oldest"
              {...register("dateOption")}
              className="radio"
              onClick={() => handleRadioClick("oldest")}
              checked={selectedDateOption === "oldest"}
            />
          </label>
        </div>
        {errors.dateOption && (
          <div className="text-red-500">{errors.dateOption.message}</div>
        )}
        <h1 className="underline">Rent:</h1>
        <h2>Min:</h2>
        <label className="form-control w-full max-w-xs">
          <input
            type="number"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            {...register("minRent")}
          />
        </label>
        {errors.minRent && (
          <div className="text-red-500">{errors.minRent.message}</div>
        )}
        <h2>Max</h2>
        <label className="form-control w-full max-w-xs">
          <input
            type="number"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            {...register("maxRent")}
          />
        </label>
        {errors.maxRent && (
          <div className="text-red-500">{errors.maxRent.message}</div>
        )}
        <details className="dropdown">
          <summary className="btn m-1">Apartment</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <div className="form-control">
              {apartmentNames.map((name) => (
                <label key={name} className="label cursor-pointer">
                  <span className="label-text">{name}</span>
                  <input
                    type="checkbox"
                    value={name}
                    {...register("aptOption")}
                    className="checkbox"
                  />
                </label>
              ))}
            </div>
          </ul>
        </details>
        <details className="dropdown">
          <summary className="btn m-1">Layout</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <div className="form-control">
              {layOutTypes.map((name) => (
                <label key={name} className="label cursor-pointer">
                  <span className="label-text">{name}</span>
                  <input
                    type="checkbox"
                    value={name}
                    {...register("layOutOption")}
                    className="checkbox"
                  />
                </label>
              ))}
            </div>
          </ul>
        </details>

        <div className="flex justify-between">
          <button type="submit" className="btn">
            Submit
          </button>
          <button type="button" onClick={handleReset} className="btn">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SortBar;

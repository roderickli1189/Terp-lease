import React, { useEffect, useState } from "react";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const schema = z.object({
  dateOption: z.string({ message: "Form cannot be empty" }),
});

const SortBar = ({ setSortOption }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setSortOption(data.dateOption);
  };

  return (
    //h-screen fucks it up tho
    <div className="flex flex-col items-center justify-start w-1/6 border-r-2 border-red-500 m-6">
      <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full">
        <h1 className="underline">Filter Options</h1>
        <h2>Date:</h2>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Newest</span>
            <input
              type="radio"
              value="newest"
              {...register("dateOption")}
              className="radio"
            />
          </label>

          <label className="label cursor-pointer">
            <span className="label-text">Oldest</span>
            <input
              type="radio"
              value="oldest"
              {...register("dateOption")}
              className="radio"
            />
          </label>
        </div>
        {errors.dateOption && (
          <div className="text-red-500">{errors.dateOption.message}</div>
        )}
        <div className="flex justify-center">
          <button type="submit" className="btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SortBar;

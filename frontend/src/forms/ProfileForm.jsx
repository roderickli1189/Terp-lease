import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth0 } from "@auth0/auth0-react";

const phoneNumber = z
  .string()
  .optional()
  .refine(
    (val) => {
      const regex = /^\d{3}-\d{3}-\d{4}$/;
      return !val || regex.test(val);
    },
    {
      message: "Invalid phone number format",
    }
  );

const schema = z
  .object({
    name: z.string().optional(),
    nickname: z.string().optional(),
    phoneNumber: phoneNumber,
  })
  .refine(
    (data) => {
      return !!data.name || !!data.nickname || !!data.phoneNumber;
    },
    {
      message: "At least one field must be filled out",
      path: ["name"],
    }
  );

const ProfileForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "update:user",
        },
      });

      const payload = {
        ...data,
        id: user.sub,
      };
      const url = "http://127.0.0.1:5000/update_profile";
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
        console.log("failed to update user");
        const data = await response.json();
        console.log(data.error);
        setError("root", { message: data.error });
      } else {
        console.log("updated user!");
        const data = await response.json();
        console.log(data);
        document.getElementById("my_modal_2").showModal();
        reset();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="container mx-auto max-w-md">
      <form
        className="flex flex-col items-center border-2 border-black rounded-lg p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-bold underline text-lg mb-6">
          Profile Update Form
        </h1>
        <label htmlFor="name" className="block mb-1">
          Name
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          placeholder="new name"
          className="input input-bordered w-full max-w-xs mb-2"
        />
        {errors.name && (
          <div className="text-red-500">{errors.name.message}</div>
        )}
        <label htmlFor="nickname" className="block mb-1">
          Nickname
        </label>
        <input
          {...register("nickname")}
          type="text"
          id="nickname"
          placeholder="new nickname"
          className="input input-bordered w-full max-w-xs mb-2"
        />
        {errors.nickname && (
          <div className="text-red-500">{errors.nickname.message}</div>
        )}
        <label className="form-control w-full max-w-xs mb-1">
          <div className="label">
            <span className="label-text">Phone Number</span>
            <span className="label-text-alt">(format - xxx-xxx-xxxx)</span>
          </div>
          <input
            {...register("phoneNumber")}
            type="tel"
            id="phoneNumber"
            placeholder="012-345-6789"
            className="input input-bordered w-full max-w-xs mb-2"
          />
        </label>
        {errors.phoneNumber && (
          <div className="text-red-500">{errors.phoneNumber.message}</div>
        )}

        <button type="submit" className="btn">
          Submit
        </button>
        {errors.root && (
          <div className="text-red-500">{errors.root.message}</div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;

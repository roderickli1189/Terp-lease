import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth0 } from "@auth0/auth0-react";

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "name must contain at least 1 character(s)" }),
});

const ProfileForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const onSubmit = async (data) => {
    try {
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
        <div className="mb-4 p-3 rounded-lg">
          <label htmlFor="name" className="block mb-1">
            name:
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            placeholder="new name"
            className="input input-bordered w-full max-w-xs"
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>
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

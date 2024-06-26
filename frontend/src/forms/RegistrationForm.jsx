import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const schema = z.object({
    username: z.string().min(1, { message: 'username must contain at least 1 character(s)' }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: 'password must contain at least 6 character(s)' }),
    confirm_password: z.string().min(1, { message: 'confirm password must contain at least 1 character(s)' })
}).refine((data) => data.password === data.confirm_password,
    {
        message: "Passwords don't match",
        path: ['confirm_password']
    });


const RegistrationForm = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log("holly molly i wana blow up")
    };

    return (
        <div className="container mx-auto max-w-md">
            <form className="flex flex-col items-center border-2 border-black rounded-lg p-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2 p-1 rounded-lg">
                    <label htmlFor="username" className="block mb-1">Username:</label>
                    <input {...register('username')} type="text" id="username" placeholder="Username" className="px-4 py-2 border rounded-lg w-full" />
                    {errors.username && <div className="text-red-500">{errors.username.message}</div>}
                </div>
                <div className="mb-2 p-1 rounded-lg">
                    <label htmlFor="email" className="block mb-1">Email:</label>
                    <input {...register('email')} type="text" id="email" placeholder="Email" className="px-4 py-2 border rounded-lg w-full" />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
                <div className="mb-2 p-1 rounded-lg">
                    <label htmlFor="password" className="block mb-1">Password:</label>
                    <input {...register('password')} type="password" id="password" placeholder="Password" className="px-4 py-2 border rounded-lg w-full" />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>
                <div className="mb-2 p-1 rounded-lg">
                    <label htmlFor="confirm_password" className="block mb-1">Confirm Password:</label>
                    <input {...register('confirm_password')} type="password" id="confirm_password" placeholder="Confirm Password" className="px-4 py-2 border rounded-lg w-full" />
                    {errors.confirm_password && <p className="text-red-500">{errors.confirm_password.message}</p>}
                </div>
                <button type="submit" className="border-2 border-black rounded-full p-2">Submit</button>
            </form>
        </div>
    );
};

export default RegistrationForm
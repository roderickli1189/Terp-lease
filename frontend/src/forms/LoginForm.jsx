import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react'

const schema = z.object({
    username: z.string().min(1, { message: 'username must contain at least 1 character(s)' }),
    password: z.string().min(1, { message: 'password must contain at least 1 character(s)' })
});

const LoginForm = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        const url = "http://127.0.0.1:5000/login"
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200) {
            console.log("fails")
            const data = await response.json()
            setError(data.err, { message: data.message })
        } else {
            console.log("works")
            navigate('/')
        }
    };

    return (
        <div className="container mx-auto max-w-md">
            <form className="flex flex-col items-center border-2 border-black rounded-lg p-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4 p-3 rounded-lg">
                    <label htmlFor="username" className="block mb-1">Username:</label>
                    <input {...register('username')} type="text" id="username" placeholder="Username" className="px-4 py-2 border rounded-lg w-full" />
                    {errors.username && <div className="text-red-500">{errors.username.message}</div>}
                </div>
                <div className="mb-4 p-3 rounded-lg">
                    <label htmlFor="password" className="block mb-1">Password:</label>
                    <input {...register('password')} type="password" id="password" placeholder="Password" className="px-4 py-2 border rounded-lg w-full" />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>
                <button type="submit" className="border-2 border-black rounded-full p-2">Submit</button>
                {errors.root && <div className="text-red-500">{errors.root.message}</div>}
            </form>
        </div>
    );
};

export default LoginForm
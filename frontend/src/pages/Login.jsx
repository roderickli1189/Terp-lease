import Header from '../Header'
import LoginForm from '../forms/LoginForm'
import LoginButton from '../LoginButton'

function Login() {
    return <>
        <Header />
        <h1 className="flex justify-center font-bold underline text-2xl pb-2">Login</h1>
        <LoginForm />
        <LoginButton />
    </>
}

export default Login
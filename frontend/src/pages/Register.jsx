import Header from '../Header'
import RegistrationForm from '../forms/RegistrationForm'

function Register() {
    return <>
        <Header />
        <h1 className="flex justify-center font-bold underline text-2xl pb-2">Register</h1>
        <RegistrationForm />
    </>
}

export default Register
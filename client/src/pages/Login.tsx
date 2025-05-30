import { useState, type FormEvent, type ChangeEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Add useNavigate
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import "../css/Login.css";
import Auth from '../utils/auth';

const Login = () => {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [login, { error }] = useMutation(LOGIN_USER);
    const navigate = useNavigate(); // ✅ Create navigate function
    useEffect(() => {
        // Always clear any lingering auth tokens on login page
        localStorage.removeItem('id_token');
        localStorage.removeItem('profileId');
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const { data } = await login({
                variables: { ...formState },
            });

            Auth.login(data.login.token);
            localStorage.setItem('profileId', data.login.profile._id);


            // ✅ Redirect to homepage after successful login
            navigate('/home'); // Replace with '/' or your desired route
        } catch (e) {
            console.error(e);
        }

        setFormState({
            email: '',
            password: '',
        });
    };

    return (
        <div className='login-container'>
            <h2>Login</h2>
            <form onSubmit={handleFormSubmit}>
                <div className='form-group'>
                    <label htmlFor='email'>Email address:</label>
                    <input
                        type='email'
                        name='email'
                        id='email'
                        value={formState.email}
                        onChange={handleChange}
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='password'>Password:</label>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        value={formState.password}
                        onChange={handleChange}
                    />
                </div>

                <button type='submit'>Submit</button>

                {error && (
                    <div className='error-message'>
                        {error.message}
                    </div>
                )}
            </form>

            <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP_USER } from '../utils/mutations'; // You need to define this mutation
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', password: '' });
  const [signup, { error }] = useMutation(SIGNUP_USER);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await signup({ variables: { input: formState } });
      // Optionally save token, redirect, etc.
      if (data?.addProfile?.token) {
        localStorage.setItem('id_token', data.addProfile.token);
        navigate('/home');
      }
    } catch (err) {
      // Error handled below
    }
    setLoading(false);
  };

  return (
    <div className="container flex-column align-center" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2 className="text-center mb-3">Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            className="form-input"
            name="name"
            type="text"
            value={formState.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            className="form-input"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            className="form-input"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {error && <div className="text-danger text-center mt-2">Signup failed: {error.message}</div>}
      </form>
    </div>
  );
};

export default Signup;
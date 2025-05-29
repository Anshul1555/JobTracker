import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { QUERY_ME } from '../utils/queries';
import { UPDATE_PROFILE } from '../utils/mutations';
import '../css/EditProfile.css';

const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const { data, loading } = useQuery(QUERY_ME);
    const [updateProfile] = useMutation(UPDATE_PROFILE);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (data?.me) {
            setName(data.me.name);
            setEmail(data.me.email || '');
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile({
                variables: { name, email },
            });
            alert('Profile updated successfully!');
            navigate(-1); // Navigate back after successful update
        } catch (error) {
            console.error(error);
            alert('Update failed');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="edit-profile-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" className="save-button">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProfile;

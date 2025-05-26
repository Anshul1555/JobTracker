// src/pages/AddJob.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_JOB } from '../utils/mutations';
import '../css/AddJob.css';

interface JobInput {
    title: string;
    company: string;
    link?: string;
    status: string;
}

const addJobStatusOptions = [
    "Applied",
    "Interview Scheduled",
    "Interview Completed",
    "Offer Accepted",
    "Offer Declined",
    "Rejected",
    "Withdrawn",
    "On Hold",
    // add more if needed
];

const AddJob: React.FC<{ profileId: string }> = ({ profileId }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<JobInput>({
        title: '',
        company: '',
        link: '',
        status: 'Applied',
    });

    const [addJob, { loading, error }] = useMutation(ADD_JOB, {
        onCompleted: () => {
            navigate('/home'); // Redirect after successful addition
        },
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await addJob({
                variables: {
                    profileId,
                    job: formData,
                },
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="addjob-container">
            <h2>Add a New Job Application</h2>
            <form className="addjob-form" onSubmit={handleSubmit}>
                <label htmlFor="company">Company Name</label>
                <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company Name"
                    required
                />

                <label htmlFor="title">Job Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Job Title"
                    required
                />

                <label htmlFor="link">Job Link</label>
                <input
                    type="url"
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="Optional job link"
                />

                <label htmlFor="status">Status</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    {addJobStatusOptions.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                            {statusOption}
                        </option>
                    ))}
                </select>

                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Job'}
                </button>
                {error && (
                    <p className="error-message">Failed to add job. Please try again.</p>
                )}
            </form>
        </div>
    );
};

export default AddJob;

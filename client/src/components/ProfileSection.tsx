import React from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { QUERY_ME } from '../utils/queries';
import '../css/ProfileSection.css';

interface Job {
    _id: string;
    title: string;
    company?: string;
    status?: string;
}

const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ProfileSection: React.FC = () => {
    const { loading, error, data } = useQuery(QUERY_ME);
    const navigate = useNavigate();

    if (loading) {
        return <div className="profile-section">Loading profile...</div>;
    }

    if (error || !data?.me) {
        return <div className="profile-section">No profile data available.</div>;
    }

    const { name, email, jobs } = data.me;
    const initials = getInitials(name);

    const allJobs: Job[] = jobs || [];
    const jobsApplied = allJobs.length;
    const interviewsScheduled = allJobs.filter((job: Job) =>
        job.status === 'Interview Scheduled' || job.status === 'Interview Completed'
    ).length;
    const offersReceived = allJobs.filter((job: Job) => job.status === 'Offer Accepted').length;

    const interviewRate = jobsApplied > 0 ? ((interviewsScheduled / jobsApplied) * 100).toFixed(1) : '0';
    const offerRate = jobsApplied > 0 ? ((offersReceived / jobsApplied) * 100).toFixed(1) : '0';

    return (
        <div className="profile-section">
            <div className="profile-image-placeholder">
                {initials}
            </div>
            <div className="profile-details">
                <p><span className="detail-label">Name:</span> {name}</p>
                <p><span className="detail-label">Email:</span> {email} </p>
                <p><span className="detail-label">Jobs Applied:</span> {jobsApplied}</p>
            </div>

            <div className="job-stats">
                <h3>Your Progress</h3>
                <p><span className="detail-label">Interviews:</span> {interviewsScheduled} ({interviewRate}%)</p>
                <p><span className="detail-label">Offers:</span> {offersReceived} ({offerRate}%)</p>
            </div>

            <div className="sidebar-quick-actions">
                <button className="sidebar-button" onClick={() => navigate('/edit-profile')}>
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileSection;

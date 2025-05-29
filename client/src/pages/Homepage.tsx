import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { UPDATE_JOB_STATUS, DELETE_JOB } from '../utils/mutations';
import ProfileSection from '../components/ProfileSection';
import JobCard from '../components/JobCard';
import '../css/HomePage.css';

interface Job {
    id: string;
    title: string;
    company: string;
    link: string;
    status: string;
}

interface MeData {
    me: {
        _id: string;
        name: string;
        jobs: {
            _id: string;
            title: string;
            company?: string;
            link: string;
            status?: string;
        }[] | null;
    } | null;
}

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { loading, error, data, refetch } = useQuery<MeData>(QUERY_ME);

    const [updateJobStatus] = useMutation(UPDATE_JOB_STATUS);
    const [deleteJob] = useMutation(DELETE_JOB);

    const [jobs, setJobs] = useState<Job[]>([]);
    const [activeTab, setActiveTab] = useState('applications');

    useEffect(() => {
        if (data?.me?.jobs) {
            const mappedJobs = data.me.jobs.map(job => ({
                id: job._id,
                title: job.title,
                company: job.company ?? '',
                link: job.link,
                status: job.status ?? 'Applied',
            }));
            setJobs(mappedJobs);
        }
    }, [data]);

    const handleStatusChange = async (jobId: string, newStatus: string) => {
        try {
            await updateJobStatus({
                variables: { jobId, status: newStatus },
            });
            await refetch();
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleDelete = async (jobId: string) => {
        try {
            await deleteJob({ variables: { jobId } });
            await refetch();
        } catch (err) {
            console.error('Error deleting job:', err);
        }
    };

    if (loading) {
        return (
            <div className="homepage-message loading">
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (error || !data?.me) {
        return (
            <div className="homepage-message error">
                <p>Oops! Something went wrong while fetching your profile.</p>
            </div>
        );
    }

    const interviews = jobs.filter(job =>
        job.status === 'Interview Scheduled' || job.status === 'Interview Completed'
    );

    return (
        <div className="homepage-layout">
            <aside className="homepage-sidebar">
                <ProfileSection />
                <nav className="main-navigation">
                    <button className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
                        My Applications
                    </button>
                    <button className={`nav-item ${activeTab === 'interviews' ? 'active' : ''}`} onClick={() => setActiveTab('interviews')}>
                        Upcoming Interviews ({interviews.length})
                    </button>
                    <button className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
                        Documents
                    </button>
                    <button className={`nav-item ${activeTab === 'network' ? 'active' : ''}`} onClick={() => setActiveTab('network')}>
                        Network
                    </button>
                    <button className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                        Analytics
                    </button>
                </nav>
            </aside>

            <main className="homepage-main">
                {activeTab === 'applications' && (
                    <>
                        <div className="homepage-controls">
                            <h2 className="section-title">My Job Applications</h2>
                            <button className="add-job-button" onClick={() => navigate('/add-job')}>
                                + Add Job
                            </button>
                        </div>

                        {jobs.length === 0 ? (
                            <p className="empty-jobs-message">
                                You haven’t added any job applications yet. Click “Add Job” to get started!
                            </p>
                        ) : (
                            <section className="job-cards-section">
                                {jobs.map((job) => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </section>
                        )}
                    </>
                )}

                {activeTab === 'interviews' && (
                    <section className="interviews-section">
                        <div className="homepage-controls">
                            <h2 className="section-title">Upcoming Interviews</h2>
                        </div>
                        {interviews.length === 0 ? (
                            <p className="empty-jobs-message">No interviews scheduled yet. Keep applying!</p>
                        ) : (
                            <div className="interview-cards-container">
                                {interviews.map(job => (
                                    <div key={job.id} className="interview-card">
                                        <h3>{job.title} at {job.company}</h3>
                                        <p>Status: {job.status}</p>
                                        <p>Date: N/A (Add date field)</p>
                                        <p>Time: N/A (Add time field)</p>
                                        {job.link && (
                                            <a href={job.link.startsWith('http') ? job.link : `https://${job.link}`} target="_blank" rel="noopener noreferrer">
                                                Job Link
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'documents' && (
                    <section className="documents-section">
                        <div className="homepage-controls">
                            <h2 className="section-title">My Documents</h2>
                            <button className="add-document-button">Upload Document</button>
                        </div>
                        <p className="empty-jobs-message">Manage your resumes, cover letters, and other documents here.</p>
                    </section>
                )}

                {activeTab === 'network' && (
                    <section className="network-section">
                        <div className="homepage-controls">
                            <h2 className="section-title">My Network</h2>
                            <button className="add-contact-button">Add Contact</button>
                        </div>
                        <p className="empty-jobs-message">Keep track of your professional contacts.</p>
                    </section>
                )}

                {activeTab === 'analytics' && (
                    <section className="analytics-section">
                        <div className="homepage-controls">
                            <h2 className="section-title">Job Search Analytics</h2>
                        </div>
                        <p className="empty-jobs-message">Visualize your job search progress with charts and graphs!</p>
                    </section>
                )}
            </main>
        </div>
    );
};

export default HomePage;

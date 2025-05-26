// src/components/JobCard.tsx
import React from 'react';
import '../css/JobCard.css';

const jobCardStatusOptions = [
    "Applied",
    "Interview Scheduled",
    "Interview Completed",
    "Offer Accepted",
    "Offer Declined",
    "Rejected",
    "Withdrawn",
    "On Hold",
];

interface JobCardProps {
    job: {
        id: string;
        title: string;
        company: string;
        link: string;
        status: string;
    };
    onStatusChange?: (id: string, newStatus: string) => void;
    onDelete?: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onStatusChange, onDelete }) => {
    return (
        <div className="job-card">
            <p className="job-info">
                <span className="info-label">Job -</span> {job.title}
            </p>

            <p className="job-info">
                <span className="info-label">Company Name -</span> {job.company}
            </p>

            <p className="job-info">
                <span className="info-label">Link -</span>{' '}
                <a
                    href={`https://${job.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {job.link}
                </a>
            </p>

            <div className="card-actions">
                <select
                    className="droplist"
                    value={job.status}
                    onChange={(e) => onStatusChange?.(job.id, e.target.value)}
                >
                    {jobCardStatusOptions.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                            {statusOption}
                        </option>
                    ))}
                </select>

                <button className="delete-btn" onClick={() => onDelete?.(job.id)}>
                    &#128465;
                </button>
            </div>
        </div>
    );
};

export default JobCard;

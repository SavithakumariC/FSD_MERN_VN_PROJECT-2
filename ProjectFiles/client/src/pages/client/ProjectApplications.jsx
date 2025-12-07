import React, { useContext, useEffect, useState } from 'react'
import '../../styles/client/ClientApplications.css'
import { GeneralContext } from '../../context/GeneralContext';
import { useNavigate } from 'react-router-dom';

const ProjectApplications = () => {
  const { api } = useContext(GeneralContext);
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [displayApplications, setDisplayApplications] = useState([]);
  const [projectTitles, setProjectTitles] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [])

  const fetchApplications = async() => {
    try {
      setLoading(true);
      const response = await api.get('/fetch-applications');
      
      const clientId = localStorage.getItem('userId');
      const filteredApps = response.data.filter(app => app.clientId === clientId);
      
      setApplications(filteredApps);
      setDisplayApplications([...filteredApps].reverse());
      
      // Get unique project titles
      const titles = [...new Set(filteredApps.map(app => app.title))];
      setProjectTitles(titles);
      
      setLoading(false);
    } catch(err) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.msg || err.message);
      setLoading(false);
      
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/authenticate');
      }
    }
  }

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this application?')) {
      return;
    }
    
    try {
      await api.get(`/approve-application/${id}`);
      alert("Application approved successfully!");
      fetchApplications();
    } catch (err) {
      console.error('Approve error:', err);
      alert("Operation failed!");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this application?')) {
      return;
    }
    
    try {
      await api.get(`/reject-application/${id}`);
      alert("Application rejected!");
      fetchApplications();
    } catch (err) {
      console.error('Reject error:', err);
      alert("Operation failed!");
    }
  };

  const handleFilterChange = (value) => {
    setProjectFilter(value);
    
    if(value === '') {
      setDisplayApplications([...applications].reverse());
    } else {
      const filtered = applications.filter(app => app.title === value);
      setDisplayApplications([...filtered].reverse());
    }
  }

  return (
    <div className="client-applications-page">
      <div className="applications-header">
        <h3>Applications</h3>
        
        {projectTitles.length > 0 ? (
          <select 
            className='form-control' 
            value={projectFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">All Projects</option>
            {projectTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        ) : !loading && (
          <p className="no-projects-text">No projects with applications yet</p>
        )}
      </div>

      <div className="client-applications-body">
        {loading ? (
          <div className="loading-state">
            <p>Loading applications...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>Error loading applications</p>
          </div>
        ) : displayApplications.length === 0 ? (
          <div className="empty-state">
            <p>No applications found.</p>
            <p>Freelancers need to bid on your projects first.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/new-project')}
            >
              Create New Project
            </button>
          </div>
        ) : (
          displayApplications.map((application) => (
            <div className="client-application" key={application._id}>
              <div className="client-application-body">
                <div className="client-application-half">
                  <div className="application-section">
                    <h4 className="project-title">{application.title}</h4>
                    <p className="project-description">{application.description}</p>
                  </div>
                  
                  <div className="application-section">
                    <h5 className="section-title">Required Skills</h5>
                    <div className="skills-container">
                      {application.requiredSkills?.map((skill) => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="application-details">
                    <p className="budget-amount">Budget: <span>&#8377; {application.budget}</span></p>
                  </div>
                </div>

                <div className="vertical-divider"></div>

                <div className="client-application-half"> 
                  <div className="application-section">
                    <h5 className="freelancer-name">{application.freelancerName || 'Unknown Freelancer'}</h5>
                    <p className="freelancer-email">{application.freelancerEmail || 'No email provided'}</p>
                  </div>
                  
                  <div className="application-section">
                    <h5 className="section-title">Proposal</h5>
                    <p className="proposal-text">{application.proposal || 'No proposal provided'}</p>
                  </div>
                  
                  <div className="application-section">
                    <h5 className="section-title">Freelancer Skills</h5>
                    <div className="skills-container">
                      {application.freelancerSkills?.map((skill) => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="application-details">
                    <p className="bid-amount">Proposed Budget: <span>&#8377; {application.bidAmount || 0}</span></p>
                    {application.estimatedTime && (
                      <p className="time-estimate">Estimated Time: {application.estimatedTime} days</p>
                    )}
                  </div>
                  
                  <div className="action-buttons">
                    {application.status === 'Pending' ? (
                      <div className="button-group">
                        <button 
                          className="btn approve-btn"
                          onClick={() => handleApprove(application._id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn reject-btn"
                          onClick={() => handleReject(application._id)}
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <div className={`status-indicator status-${application.status.toLowerCase()}`}>
                        Status: <strong>{application.status}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ProjectApplications;
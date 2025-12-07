import React, { useContext, useEffect, useState } from 'react';
import '../../styles/freelancer/freelancer.css';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../../context/GeneralContext';

const Freelancer = () => {
  const { api } = useContext(GeneralContext);
  const navigate = useNavigate();

  const [isDataUpdateOpen, setIsDataUpdateOpen] = useState(false);
  const [freelancerData, setFreelancerData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [description, setDescription] = useState('');
  const [freelancerId, setFreelancerId] = useState('');
  const [updateSkills, setUpdateSkills] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [applicationsCount, setApplicationsCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchApplications();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        console.error('No userId found in localStorage');
        setError('User not authenticated. Please log in again.');
        setLoading(false);
        return;
      }
      
      console.log('Fetching freelancer data for userId:', userId);
      
      const response = await api.get(`/fetch-freelancer/${userId}`);
      console.log('Freelancer data response:', response.data);
      
      if (response.data && response.data._id) {
        setFreelancerData(response.data);
        setFreelancerId(response.data._id);
        setSkills(response.data.skills || []);
        setDescription(response.data.description || '');
        setUpdateSkills(Array.isArray(response.data.skills) ? response.data.skills.join(', ') : '');
        setUpdateDescription(response.data.description || '');
        setLoading(false);
        setError(null);
      } else {
        // Freelancer doesn't exist yet in database
        console.log('Freelancer profile not found in database');
        setFreelancerData(null);
        setFreelancerId(userId);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching freelancer data:', err);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      if (err.response?.status === 404) {
        console.log('Freelancer not found (404) - will create new profile');
        setFreelancerData(null);
        const userId = localStorage.getItem('userId');
        setFreelancerId(userId);
      } else {
        setError('Failed to load profile data. Please try again.');
      }
      setLoading(false);
    }
  };

  const updateUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        alert('User ID not found. Please log in again.');
        return;
      }
      
      // First try to update existing freelancer
      console.log('Attempting to update freelancer:', {
        freelancerId: userId,
        updateSkills,
        description: updateDescription
      });
      
      const response = await api.post('/update-freelancer', {
        freelancerId: userId,
        updateSkills,
        description: updateDescription
      });
      
      console.log('Update successful:', response.data);
      alert('Profile updated successfully!');
      fetchUserData();
      setIsDataUpdateOpen(false);
    } catch (err) {
      console.error('Error updating freelancer:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.data?.msg === 'Freelancer not found') {
        // Freelancer doesn't exist, need to create one first
        console.log('Freelancer not found, creating new profile...');
        await createOrUpdateFreelancer();
      } else {
        alert(`Failed to update data: ${err.response?.data?.msg || 'Please try again.'}`);
      }
    }
  };

  const createOrUpdateFreelancer = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email');
      
      console.log('Creating/updating freelancer with upsert logic');
      
      // Try to create or update using the same endpoint but different approach
      // First check if freelancer exists by userId
      try {
        const existingFreelancer = await api.get(`/fetch-freelancer/${userId}`);
        
        if (existingFreelancer.data && existingFreelancer.data._id) {
          // Update existing
          console.log('Found existing freelancer, updating...');
          const response = await api.post('/update-freelancer', {
            freelancerId: existingFreelancer.data._id,
            updateSkills,
            description: updateDescription
          });
          console.log('Update response:', response.data);
          alert('Profile updated successfully!');
          fetchUserData();
          setIsDataUpdateOpen(false);
          return;
        }
      } catch (fetchErr) {
        console.log('No existing freelancer found, will create new one');
      }
      
      // If we get here, need to create a new freelancer
      console.log('Creating new freelancer profile...');
      
      // Try different approaches to create freelancer
      const createMethods = [
        // Method 1: Try /api/create-freelancer
        () => api.post('/api/create-freelancer', {
          userId,
          username,
          email,
          skills: updateSkills,
          description: updateDescription
        }),
        
        // Method 2: Try /create-freelancer
        () => api.post('/create-freelancer', {
          userId,
          username,
          email,
          skills: updateSkills,
          description: updateDescription
        }),
        
        // Method 3: Try /freelancer/create
        () => api.post('/freelancer/create', {
          userId,
          username,
          email,
          skills: updateSkills,
          description: updateDescription
        }),
        
        // Method 4: Try to create via update endpoint with different ID
        () => api.post('/update-freelancer', {
          userId,
          username,
          email,
          updateSkills,
          description: updateDescription
        })
      ];
      
      let success = false;
      for (let i = 0; i < createMethods.length; i++) {
        try {
          console.log(`Trying create method ${i + 1}...`);
          const response = await createMethods[i]();
          console.log(`Create method ${i + 1} successful:`, response.data);
          alert('New freelancer profile created successfully!');
          fetchUserData();
          setIsDataUpdateOpen(false);
          success = true;
          break;
        } catch (methodErr) {
          console.log(`Create method ${i + 1} failed:`, methodErr.message);
        }
      }
      
      if (!success) {
        throw new Error('All create methods failed');
      }
      
    } catch (err) {
      console.error('Error creating freelancer profile:', err);
      alert('Could not create freelancer profile. Please contact support or check server routes.');
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get('/fetch-applications');
      const userId = localStorage.getItem('userId');
      const apps = response.data.filter(app => app.freelancerId === userId);
      setApplicationsCount(apps);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="freelancer-home">
        <div className="loading-state">
          <p>Loading your dashboard...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="freelancer-home">
        <div className="error-state">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchUserData}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No freelancer data state (first-time setup)
  if (!freelancerData) {
    return (
      <div className="freelancer-home">
        <div className="setup-profile">
          <h3>Welcome to SB Works!</h3>
          <p>Set up your freelancer profile to start getting projects</p>
          <button 
            className="btn btn-success" 
            onClick={() => setIsDataUpdateOpen(true)}
          >
            Setup My Profile
          </button>
        </div>

        {isDataUpdateOpen && (
          <div className="freelancer-details-update initial-setup">
            <h4>Complete Your Profile</h4>
            <div className="form-group">
              <label htmlFor="mySkills"><h5>Your Skills</h5></label>
              <input 
                type="text" 
                className="form-control" 
                id="mySkills" 
                placeholder="Enter your skills separated by commas (e.g., React, Node.js, MongoDB)"
                value={updateSkills}
                onChange={(e) => setUpdateSkills(e.target.value)}
              />
              <small className="form-text">Separate each skill with a comma</small>
            </div>

            <div className="form-group">
              <label htmlFor="description-textarea"><h5>About You</h5></label>
              <textarea 
                className="form-control" 
                id="description-textarea" 
                placeholder="Tell clients about your experience, expertise, and what you can do for them..."
                value={updateDescription}
                onChange={(e) => setUpdateDescription(e.target.value)}
                rows="5"
              />
            </div>

            <div className="button-group">
              <button className="btn btn-success" onClick={updateUserData}>
                Save & Continue
              </button>
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => setIsDataUpdateOpen(false)}
              >
                Skip for Now
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main dashboard (freelancer exists)
  return (
    <div className="freelancer-home">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h2>Welcome back, {localStorage.getItem('username') || 'Freelancer'}!</h2>
        <p className="welcome-subtitle">Here's your freelancing overview</p>
      </div>

      {/* Stats Cards */}
      <div className="home-cards">
        <div className="home-card">
          <h4>Current Projects</h4>
          <p className="count">{freelancerData.currentProjects?.length || 0}</p>
          <p className="card-subtext">Projects in progress</p>
          <button 
            className="btn-card" 
            onClick={() => navigate('/my-projects')}
            disabled={!freelancerData.currentProjects?.length}
          >
            View Projects
          </button>
        </div>

        <div className="home-card">
          <h4>Completed Projects</h4>
          <p className="count">{freelancerData.completedProjects?.length || 0}</p>
          <p className="card-subtext">Successfully delivered</p>
          <button 
            className="btn-card" 
            onClick={() => navigate('/my-projects')}
            disabled={!freelancerData.completedProjects?.length}
          >
            View Projects
          </button>
        </div>

        <div className="home-card">
          <h4>Applications</h4>
          <p className="count">{applicationsCount.length}</p>
          <p className="card-subtext">Proposals submitted</p>
          <button 
            className="btn-card" 
            onClick={() => navigate('/myApplications')}
            disabled={!applicationsCount.length}
          >
            View Applications
          </button>
        </div>

        <div className="home-card">
          <h4>Available Funds</h4>
          <p className="count">&#8377; {freelancerData.funds || 0}</p>
          <p className="card-subtext">Ready to withdraw</p>
          <button 
            className="btn-card"
            onClick={() => alert('Withdrawal feature coming soon!')}
            disabled={!freelancerData.funds}
          >
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="freelancer-details">
        <div className="section-header">
          <h3>My Profile</h3>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={() => setIsDataUpdateOpen(!isDataUpdateOpen)}
          >
            {isDataUpdateOpen ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {!isDataUpdateOpen ? (
          <div className="freelancer-details-data">
            <div className="profile-info">
              <div className="info-item">
                <h5>Email</h5>
                <p>{localStorage.getItem('email') || 'Not available'}</p>
              </div>
              
              <div className="info-item">
                <h5>Member Since</h5>
                <p>{new Date(freelancerData.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="skills-section">
              <h4>My Skills</h4>
              <div className="skills-container">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <span className="skill-badge" key={index}>
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <p className="no-skills">No skills added yet</p>
                )}
              </div>
            </div>

            <div className="description-section">
              <h4>About Me</h4>
              <div className="description-content">
                {description ? (
                  <p>{description}</p>
                ) : (
                  <p className="no-description">
                    You haven't added a description yet. Tell clients about your experience and expertise.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="freelancer-details-update">
            <div className="form-group">
              <label htmlFor="mySkills"><h5>My Skills</h5></label>
              <input 
                type="text" 
                className="form-control" 
                id="mySkills" 
                placeholder="React, Node.js, MongoDB, JavaScript, CSS, HTML"
                value={updateSkills}
                onChange={(e) => setUpdateSkills(e.target.value)}
              />
              <small className="form-text">Separate skills with commas</small>
            </div>

            <div className="form-group">
              <label htmlFor="description-textarea"><h5>About Me</h5></label>
              <textarea 
                className="form-control" 
                id="description-textarea" 
                placeholder="I am a full-stack developer with 3+ years of experience building web applications. I specialize in MERN stack and have worked on various e-commerce and SaaS projects..."
                value={updateDescription}
                onChange={(e) => setUpdateDescription(e.target.value)}
                rows="6"
              />
            </div>

            <div className="button-group">
              <button className="btn btn-success" onClick={updateUserData}>
                Save Changes
              </button>
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => {
                  setIsDataUpdateOpen(false);
                  // Reset to original values
                  setUpdateSkills(Array.isArray(skills) ? skills.join(', ') : '');
                  setUpdateDescription(description);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <div className="action-buttons">
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate('/all-projects')}
          >
            Browse Projects
          </button>
          <button 
            className="btn btn-outline-success"
            onClick={() => navigate('/myApplications')}
          >
            View My Applications
          </button>
          <button 
            className="btn btn-outline-info"
            onClick={() => navigate('/my-projects')}
          >
            My Projects
          </button>
        </div>
      </div>
    </div>
  );
};

export default Freelancer;
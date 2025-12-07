import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../../context/GeneralContext';
import '../../styles/freelancer/MyProjects.css'

const MyProjects = () => {
  const navigate = useNavigate();
  const { api } = useContext(GeneralContext);
  
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fetch-projects');
      
      // Filter projects assigned to current freelancer
      const freelancerId = localStorage.getItem('userId');
      const myProjects = response.data.filter(pro => 
        pro.freelancerId === freelancerId
      );
      
      console.log('All projects:', response.data);
      console.log('My projects:', myProjects);
      console.log('My projects statuses:', myProjects.map(p => ({title: p.title, status: p.status})));
      
      setProjects(myProjects);
      setDisplayProjects([...myProjects].reverse());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setLoading(false);
    }
  };

  const handleFilterChange = (status) => {
    console.log('Filter changed to:', status);
    
    let filtered = [...projects];
    
    if (status === "In Progress") {
      filtered = projects.filter((project) => 
        project.status === "Assigned" || 
        project.status === "In Progress" ||
        project.status === "Active"
      );
    } else if (status === "Completed") {
      filtered = projects.filter((project) => 
        project.status === "Completed" || 
        project.status === "Finished" ||
        project.status === "Done"
      );
    } else if (status === "Available") {
      filtered = projects.filter((project) => 
        project.status === "Available" || 
        project.status === "Open"
      );
    }
    
    console.log('Filtered projects:', filtered);
    setDisplayProjects([...filtered].reverse());
  };

  return (
    <div className="client-projects-page">
      <div className="client-projects-list">
        <div className="client-projects-header">
          <h3>My Projects</h3>
          <select 
            className='form-control' 
            onChange={(e) => handleFilterChange(e.target.value)}
            defaultValue=""
          >
            <option value="">All Projects ({projects.length})</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Available">Available</option>
          </select>
        </div>
        <hr />
        
        {loading ? (
          <div className="loading">
            <p>Loading projects...</p>
          </div>
        ) : displayProjects.length === 0 ? (
          <div className="no-projects">
            <p>No projects found.</p>
            {projects.length === 0 ? (
              <p>You haven't been assigned to any projects yet.</p>
            ) : (
              <p>No projects match the selected filter.</p>
            )}
          </div>
        ) : (
          displayProjects.map((project) => (
            <div 
              className="listed-project" 
              key={project._id} 
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <div className='listed-project-head'>
                <h3>{project.title}</h3>
                <p>{new Date(project.postedDate).toLocaleDateString()}</p>
              </div>
              <h5>Budget: &#8377; {project.budget}</h5>
              <p className="project-description">{project.description}</p>
              <div className="bids-data">
                <div className={`status-badge status-${project.status.toLowerCase().replace(' ', '-')}`}>
                  {project.status}
                </div>
              </div>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyProjects;
import React, { useContext, useEffect, useState } from 'react'
import { GeneralContext } from '../../context/GeneralContext';
import { useNavigate } from 'react-router-dom'
import '../../styles/freelancer/AllProjects.css' 

const AdminProjects = () => {
  const navigate = useNavigate();
  const { api } = useContext(GeneralContext);

  const [projects, setProjects] = useState([]);
  const [displayprojects, setDisplayProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]); 
  const [categoryFilter, setCategoryFilter] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/fetch-projects');
      setProjects(response.data);
      setDisplayProjects([...response.data].reverse());

      const skillsSet = new Set();
      response.data.forEach(project => {
        if (project.skills && Array.isArray(project.skills)) {
          project.skills.forEach(skill => skillsSet.add(skill));
        }
      });
      setAllSkills([...skillsSet]);
    } catch (err) {
      console.log(err.response?.data?.msg || err.message);
    }
  };

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCategoryFilter([...categoryFilter, value]);
    } else {
      setCategoryFilter(categoryFilter.filter(skill => skill !== value));
    }
  }

  useEffect(() => {
    if (categoryFilter.length > 0) {
      setDisplayProjects(
        projects.filter(project => 
          categoryFilter.every(skill => 
            project.skills && project.skills.includes(skill)
          )
        ).reverse()
      );
    } else {
      setDisplayProjects([...projects].reverse());
    }
  }, [categoryFilter, projects]);

  return (
    <div className="all-projects-page">
      <div className="project-filters">
        <h3>Filters</h3>
        <hr />
        <div className="filters">
          <h5>Skills</h5>
          {allSkills.length > 0 ? 
            <div className="filter-options">
              {allSkills.map((skill) => (
                <div className="form-check" key={skill}>
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    value={skill} 
                    id={`skill-${skill}`} 
                    onChange={handleCategoryCheckBox} 
                  />
                  <label className="form-check-label" htmlFor={`skill-${skill}`}>
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          : <p>No skills available</p>}
        </div>
      </div>

      <div className="projects-list">
        <h3>All projects</h3>
        <hr />
        {displayprojects.map((project) => (
          <div className="listed-project" key={project._id}>
            <div className='listed-project-head'>
              <h3>{project.title}</h3>
              <p>{project.postedDate}</p>
            </div>
            <h5>Budget &#8377; {project.budget}</h5>
            <h5>Client name: {project.clientName}</h5>
            <h5>Client email: {project.clientEmail}</h5>
            <p>{project.description}</p>
            <div className="skills">
              {project.skills && project.skills.map((skill) => (
                <h6 key={skill}>{skill}</h6>
              ))}
            </div>
            <div className="bids-data">
              <p>{project.bids ? project.bids.length : 0} bids</p>
              <h6>
                &#8377; {project.bidAmounts && project.bidAmounts.length > 0 ? 
                  project.bidAmounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0) : 
                  0} (avg bid)
              </h6>
            </div>
            <h5>Status - {project.status}</h5>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminProjects;
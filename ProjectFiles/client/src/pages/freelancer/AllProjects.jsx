import React, { useContext, useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import '../../styles/freelancer/AllProjects.css' 
import { GeneralContext } from '../../context/GeneralContext';

const AllProjects = () => {
  const navigate = useNavigate();
  const { api } = useContext(GeneralContext);

  const [projects, setProjects] = useState([]);
  const [displayprojects, setDisplayProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]); 
  const [categoryFilter, setCategoryFilter] = useState([]);

  useEffect(()=>{
    fetchProjects();
  },[])

  const fetchProjects = async() => {
    try {
      const response = await api.get('/fetch-projects');
      setProjects(response.data);
      setDisplayProjects([...response.data].reverse());

      const skillsSet = new Set();
      response.data.forEach(project => {
        project.skills?.forEach(skill => skillsSet.add(skill));
      });
      setAllSkills([...skillsSet]);
    } catch (err) {
      console.log(err.response?.data?.msg || err.message);
    }
  }

  const handleCategoryCheckBox = (e) =>{
    const value = e.target.value;
    if(e.target.checked){
      setCategoryFilter([...categoryFilter, value]);
    }else{
        setCategoryFilter(categoryFilter.filter(size=> size !== value));
    }
  }

  useEffect(()=>{
    if (categoryFilter.length > 0){
      const filtered = projects.filter(project => 
        categoryFilter.every(skill => project.skills?.includes(skill))
      );
      setDisplayProjects([...filtered].reverse());
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
              {allSkills.map((skill)=>(
                <div className="form-check" key={skill}>
                  <input className="form-check-input" type="checkbox" value={skill} 
                    onChange={handleCategoryCheckBox} />
                  <label className="form-check-label">{skill}</label>
                </div>
              ))}
            </div>
          : <p>No skills available</p>}
        </div>
      </div>

      <div className="projects-list">
        <h3>All projects</h3>
        <hr />
        {displayprojects.map((project)=>(
          <div className="listed-project" key={project._id} onClick={()=> navigate(`/project/${project._id}`)}>
            <div className='listed-project-head'>
              <h3>{project.title}</h3>
              <p>{String(project.postedDate).slice(0,24)}</p>
            </div>
            <h5>Budget &#8377; {project.budget}</h5>
            <p>{project.description}</p>
            <div className="skills">
              {project.skills?.map((skill)=>(
                <h6 key={skill}>{skill}</h6>
              ))}
            </div>
            <div className="bids-data">
              <p>{project.bids?.length || 0} bids</p>
              <h6>&#8377; {project.bidAmounts?.reduce((a,b) => a+b, 0) || 0} (avg bid)</h6>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllProjects;
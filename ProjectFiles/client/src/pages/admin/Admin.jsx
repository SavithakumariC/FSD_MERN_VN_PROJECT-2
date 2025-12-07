import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../../context/GeneralContext'; // ← Correct path

const Admin = () => {
  const navigate = useNavigate();
  const { api } = useContext(GeneralContext); // Get api from context

  const [projectsCount, setProjectsCount] = useState(0);
  const [completedProsCount, setCompletedProsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(()=>{
    fetchProjects();
    fetchApplications();
    fetchUsers();
  },[])

  const fetchProjects = async () => {
    try {
      const response = await api.get("/fetch-projects"); // Use api from context
      setProjectsCount(response.data.length);
      const comPros = response.data.filter((pro) => pro.status === "Completed");
      setCompletedProsCount(comPros.length);
    } catch (err) {
      console.log(err.response?.data?.msg || err.message);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/authenticate');
      }
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get("/fetch-applications"); // Use api from context
      setApplicationsCount(response.data.length);
    } catch (err) {
      console.log(err.response?.data?.msg || err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/fetch-users"); // Use api from context
      setUsersCount(response.data.length);
    } catch (err) {
      console.log(err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="admin-page">
        <div className="home-cards">
          <div className="home-card">
              <h4>All Projects</h4>
              <p>{projectsCount}</p>
              <button onClick={()=> navigate('/admin-projects')}>View projects</button>
          </div>
          <div className="home-card">
              <h4>Completed projects</h4>
              <p>{completedProsCount}</p>
              <button onClick={()=> navigate('/admin-projects')}>View projects</button>
          </div>
          <div className="home-card">
              <h4>Applications</h4>
              <p>{applicationsCount}</p>
              <button onClick={()=> navigate('/admin-applications')}>View Applications</button>
          </div>
          <div className="home-card">
              <h4>Users</h4>
              <p>{usersCount}</p>
              <button onClick={()=> navigate('/all-users')}>View Users</button>
          </div>
        </div>
    </div>
  )
}

export default Admin;
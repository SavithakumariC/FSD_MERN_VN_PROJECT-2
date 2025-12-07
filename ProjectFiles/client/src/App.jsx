import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Authenticate from './pages/Authenticate';
import Freelancer from './pages/freelancer/Freelancer'
import AllProjects from './pages/freelancer/AllProjects'
import MyProjects from './pages/freelancer/MyProjects'
import MyApplications from './pages/freelancer/MyApplications'
import ProjectData from './pages/freelancer/ProjectData'
import Client from './pages/client/Client'
import ProjectApplications from './pages/client/ProjectApplications'
import NewProject from './pages/client/NewProject'
import ProjectWorking from './pages/client/ProjectWorking'
import Admin from './pages/admin/Admin'
import AdminProjects from './pages/admin/AdminProjects'
import AllApplications from './pages/admin/AllApplications'
import AllUsers from './pages/admin/AllUsers'

// Protected Route Component
const ProtectedRoute = ({ children, requiredType }) => {
  const token = localStorage.getItem('token');
  const usertype = localStorage.getItem('usertype');
  
  if (!token) {
    return <Navigate to="/authenticate" replace />;
  }
  
  if (requiredType && usertype !== requiredType) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Landing />} />
        <Route path='/authenticate' element={<Authenticate />} />

        {/* Freelancer Routes */}
        <Route path='/freelancer' element={
          <ProtectedRoute requiredType="freelancer">
            <Freelancer />
          </ProtectedRoute>
        } />
        <Route path='/all-projects' element={
          <ProtectedRoute requiredType="freelancer">
            <AllProjects />
          </ProtectedRoute>
        } />
        <Route path='/my-projects' element={
          <ProtectedRoute requiredType="freelancer">
            <MyProjects />
          </ProtectedRoute>
        } /> 
        <Route path='/myApplications' element={
          <ProtectedRoute requiredType="freelancer">
            <MyApplications />
          </ProtectedRoute>
        } />
        <Route path='/project/:id' element={
          <ProtectedRoute requiredType="freelancer">
            <ProjectData />
          </ProtectedRoute>
        } />

        {/* Client Routes */}
        <Route path='/client' element={
          <ProtectedRoute requiredType="client">
            <Client />
          </ProtectedRoute>
        } />
        <Route path='/project-applications' element={
          <ProtectedRoute requiredType="client">
            <ProjectApplications />
          </ProtectedRoute>
        } />
        <Route path='/new-project' element={
          <ProtectedRoute requiredType="client">
            <NewProject />
          </ProtectedRoute>
        } />
        <Route path='/client-project/:id' element={
          <ProtectedRoute requiredType="client">
            <ProjectWorking />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path='/admin' element={
          <ProtectedRoute requiredType="admin">
            <Admin />
          </ProtectedRoute>
        } />
        <Route path='/admin-projects' element={
          <ProtectedRoute requiredType="admin">
            <AdminProjects />
          </ProtectedRoute>
        } />
        <Route path='/admin-applications' element={
          <ProtectedRoute requiredType="admin">
            <AllApplications />
          </ProtectedRoute>
        } />
        <Route path='/all-users' element={
          <ProtectedRoute requiredType="admin">
            <AllUsers />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
import React, { useContext, useState } from 'react'
import { GeneralContext } from '../../context/GeneralContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/client/newProject.css'

const NewProject = () => {
    const { api } = useContext(GeneralContext);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState(0);
    const [skills, setSkills] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!title || !description || !budget || !skills) {
            alert("All fields are required!");
            return;
        }

        try {
            const response = await api.post("/new-project", {
                title,
                description,
                budget: Number(budget),
                skills,
                clientId: localStorage.getItem("userId"),
                clientName: localStorage.getItem("username"),
                clientEmail: localStorage.getItem("email"),
            });

            alert("New project added!!");
            setTitle("");
            setDescription("");
            setBudget(0);
            setSkills("");
            navigate("/client");
        } catch (err) {
            console.log(err.response?.data?.msg || err.message);
            alert("Operation failed!!");
        }
    };

    return (
        <div className="new-project-page">
            <h3>Post new project</h3>

            <div className="new-project-form">
                {/* Title Input */}
                <input 
                    type="text" 
                    placeholder="Project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* Description Input */}
                <textarea 
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Budget and Skills in grid layout */}
                <div className="form-grid">
                    <input 
                        type="number" 
                        placeholder="Budget (in ₹)"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                    />
                    
                    <input 
                        type="text" 
                        placeholder="Required skills (separate with commas)"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                    />
                </div>

                <button onClick={handleSubmit}>
                    Submit Project
                </button>
            </div>
        </div>
    );
}

export default NewProject;
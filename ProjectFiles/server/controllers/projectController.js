import Project from "../models/Project.js";
import Freelancer from "../models/Freelancer.js";

// Fetch single project
export const fetchProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const submitProject = async (req, res) => {
  const {
    clientId,
    freelancerId,
    projectId,
    projectLink,
    manualLink,
    submissionDescription,
  } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update project submission details
    project.projectLink = projectLink;
    project.manualLink = manualLink;
    project.submissionDescription = submissionDescription;
    project.submission = true;

    await project.save();

    // Optionally, you can update freelancer's submitted projects if needed
    if (freelancerId) {
      const freelancer = await Freelancer.findOne({ userId: freelancerId });
      if (freelancer) {
        freelancer.submittedProjects = freelancer.submittedProjects || [];
        if (!freelancer.submittedProjects.includes(project._id)) {
          freelancer.submittedProjects.push(project._id);
          await freelancer.save();
        }
      }
    }

    res.status(200).json({ message: "Project submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Fetch all projects
export const fetchProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new project
export const newProject = async (req, res) => {
  try {
    const {
      title,
      description,
      budget,
      skills,
      clientId,
      clientName,
      clientEmail,
    } = req.body;

    const projectSkills = skills.split(",");
    const newProject = new Project({
      title,
      description,
      budget,
      skills: projectSkills,
      clientId,
      clientName,
      clientEmail,
      postedDate: new Date(),
    });
    await newProject.save();
    res.status(200).json({ message: "Project added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve submission
export const approveSubmission = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const freelancer = await Freelancer.findOne({
      userId: project.freelancerId,
    });
    project.submissionAccepted = true;
    project.status = "Completed";
    freelancer.currentProjects = freelancer.currentProjects.filter(
      (p) => p.toString() !== project._id.toString()
    );
    freelancer.completedProjects.push(project._id);
    freelancer.funds += project.budget;
    await project.save();
    await freelancer.save();
    res.status(200).json({ message: "Submission approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject submission
export const rejectSubmission = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    project.submission = false;
    project.projectLink = "";
    project.manualLink = "";
    project.submissionDescription = "";
    await project.save();
    res.status(200).json({ message: "Submission rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import Application from "../models/Application.js";
import User from "../models/User.js";
import Freelancer from "../models/Freelancer.js";
import Project from "../models/Project.js";

export const makeBid = async (req, res) => {
  try {
    const { clientId, freelancerId, projectId, proposal, bidAmount, estimatedTime } = req.body;

    const freelancer = await User.findById(freelancerId);
    const freelancerData = await Freelancer.findOne({ userId: freelancerId });
    const project = await Project.findById(projectId);
    const client = await User.findById(clientId);

    
    const newApplication = new Application({
      projectId,
      clientId,
      clientName: client.username,
      clientEmail: client.email,
      freelancerId,
      freelancerName: freelancer.username,
      freelancerEmail: freelancer.email,
      freelancerSkills: freelancerData.skills,
      title: project.title,
      description: project.description,
      budget: project.budget,
      requiredSkills: project.skills,
      proposal,
      bidAmount,
      estimatedTime,
    });

    const application = await newApplication.save();

    project.bids.push(freelancerId);
    project.bidAmounts.push(parseInt(bidAmount));

    if (application) freelancerData.applications.push(application._id);

    await freelancerData.save();
    await project.save();

    res.status(200).json({ message: "Bidding successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchApplications = async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve/reject similar to your original code...
// Approve and Reject applications
export const approveApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    const project = await Project.findById(application.projectId);
    const freelancer = await Freelancer.findOne({ userId: application.freelancerId });
    const user = await User.findById(application.freelancerId);

    application.status = 'Accepted';
    await application.save();

    const remainingApplications = await Application.find({ projectId: application.projectId, status: "Pending" });
    for (const appli of remainingApplications) {
      appli.status = 'Rejected';
      await appli.save();
    }

    project.freelancerId = freelancer.userId;
    project.freelancerName = user.email;
    project.budget = application.bidAmount;
    project.status = "Assigned";
    freelancer.currentProjects.push(project._id);

    await project.save();
    await freelancer.save();
    res.status(200).json({ message: "Application approved!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    application.status = 'Rejected';
    await application.save();
    res.status(200).json({ message: "Application rejected!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
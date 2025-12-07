import Freelancer from "../models/Freelancer.js";

export const fetchFreelancer = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ userId: req.params.id });
    res.status(200).json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// In your server's freelancer controller
export const updateFreelancer = async (req, res) => {
  try {
    console.log("Update request body:", req.body);

    const { freelancerId, updateSkills, description } = req.body;

    if (!freelancerId) {
      return res.status(400).json({ msg: "Freelancer ID is required" });
    }

    // Convert skills string to array
    let skillsArray = [];
    if (updateSkills && typeof updateSkills === "string") {
      skillsArray = updateSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");
    } else if (Array.isArray(updateSkills)) {
      skillsArray = updateSkills;
    }

    // Try to find OR create the freelancer
    const freelancer = await Freelancer.findOneAndUpdate(
      { _id: freelancerId },
      {
        $set: {
          skills: skillsArray,
          description: description || "",
          userId: freelancerId, // Make sure userId is set
        },
      },
      {
        new: true,
        upsert: true, // This creates if doesn't exist
        setDefaultsOnInsert: true,
      }
    );

    console.log("Freelancer created/updated:", freelancer);

    res.status(200).json({
      message: "Freelancer updated successfully",
      freelancer: {
        _id: freelancer._id,
        skills: freelancer.skills,
        description: freelancer.description,
      },
    });
  } catch (err) {
    console.error("Update freelancer error:", err);
    res.status(500).json({
      error: err.message,
      msg: "Server error while updating freelancer",
    });
  }
};

// export const updateFreelancer = async (req, res) => {
//   try {
//     const { freelancerId, updateSkills, description } = req.body;
//     const freelancer = await Freelancer.findById(freelancerId);

//     let skills = updateSkills.split(",");
//     freelancer.skills = skills;
//     freelancer.description = description;

//     await freelancer.save();
//     res.status(200).json(freelancer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

import User from "../models/userModel.js";

// ✅ Fetch all users with active/inactive status
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    // Update status based on inactivity
    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        user.checkInactive();
        await user.save();
        return user;
      })
    );

    res.json(updatedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Toggle user status manually
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();

    res.json({ message: `User marked as ${user.status}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
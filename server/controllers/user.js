import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    
    // Map to include both uid/displayName/photoURL and id/name/avatar for compatibility
    const formattedUsers = users.map((user) => ({
      _id: user._id,
      id: user._id,
      uid: user._id.toString(),
      name: user.name,
      displayName: user.name,
      email: user.email,
      avatar: user.avatar,
      photoURL: user.avatar,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      id: user._id,
      uid: user._id.toString(),
      name: user.name,
      displayName: user.name,
      email: user.email,
      avatar: user.avatar,
      photoURL: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

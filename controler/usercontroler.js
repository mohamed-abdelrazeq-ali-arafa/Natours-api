const user = require("./../models/usermodel");

exports.get_all = async (req, res, next) => {
  try {
    
    const users = await user.find({});
    res.status(200).json({
      status: "success",
      length: users.length,
      data: users,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
    });
  }
};

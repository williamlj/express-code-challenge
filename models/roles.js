//roles.js
const mongoose = require("mongoose");
const User = require("./users");

const roleSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  }
});
//cascade on delete, not tested :P
roleSchema.post("remove", document => {
  const roleId = document._id;
  User.find({ roles: { $in: [roleId] } }).then(users => {
    Promise.all(
      users.map(user =>
        User.findOneAndUpdate(
          user._id,
          { $pull: { roles: roleId } },
          { new: true }
        )
      )
    );
  });
});

const Role = module.exports = mongoose.model("Role", roleSchema);

module.exports.getBasicRole = (callback) => {
  Role.findOne({}).exec(callback);
}

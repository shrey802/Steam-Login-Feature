const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        displayName: {
            type: String,
            required: true,
            lowercase: true
        },

        avatar: {
            type: String,
            required: true
        },

        steamId: {
            type: String,
            required: true 
        },

    }
);
UserSchema.post('save', (doc, next) => {
    console.log("User saved");
    next();
})
module.exports = mongoose.model("User", UserSchema);
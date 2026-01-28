const mongoose = require('mongoose');
require('dotenv').config();

const email = "vijaish95609@gmail.com";

const userSchema = new mongoose.Schema({
    email: String,
    email1: String
}, { strict: false });

const User = mongoose.model('users', userSchema);

async function checkUser() {
    try {
        console.log("Connecting to:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected. Searching for:", email);

        const user = await User.findOne({
            $or: [{ email: email }, { email1: email }]
        });

        if (user) {
            console.log("User FOUND in Chicago Visa API:", user);
        } else {
            console.log("User NOT FOUND in Chicago Visa API");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkUser();

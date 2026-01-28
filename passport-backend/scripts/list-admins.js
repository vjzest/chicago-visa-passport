const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load envs
const chicagoEnvPath = path.resolve(__dirname, '../../chicago-visa-api/.env');
const chicagoEnv = dotenv.config({ path: chicagoEnvPath }).parsed;

if (!chicagoEnv) {
    console.error("Could not load .env file");
    process.exit(1);
}

const chicagoUri = chicagoEnv.MONGO_URI;
const adminSchema = new mongoose.Schema({}, { strict: false });

const run = async () => {
    const chicagoConn = await mongoose.createConnection(chicagoUri).asPromise();
    console.log("Connected to Chicago DB");

    const ChicagoAdmin = chicagoConn.model('admins', adminSchema);
    const admins = await ChicagoAdmin.find({}, 'email firstName lastName');

    console.log("\nAvailable Admins:");
    admins.forEach(a => {
        console.log(`- ${a.get('email')} (${a.get('firstName')} ${a.get('lastName')})`);
    });

    process.exit(0);
};

run().catch(err => console.error(err));

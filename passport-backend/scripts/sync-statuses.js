const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load envs
const chicagoEnvPath = path.resolve(__dirname, '../../chicago-visa-api/.env');
const passportEnvPath = path.resolve(__dirname, '../.env');

const chicagoEnv = dotenv.config({ path: chicagoEnvPath }).parsed;
const passportEnv = dotenv.config({ path: passportEnvPath }).parsed;

if (!chicagoEnv || !passportEnv) {
    console.error("Could not load .env files");
    process.exit(1);
}

const chicagoUri = chicagoEnv.MONGO_URI;
const passportUri = passportEnv.MONGO_URI;

// Generic Schema to capture everything
const statusSchema = new mongoose.Schema({}, { strict: false });

const run = async () => {
    console.log("Starting Status Sync...");

    // 1. Connect to Chicago
    const chicagoConn = await mongoose.createConnection(chicagoUri).asPromise();
    const ChicagoStatus = chicagoConn.model('statuses', statusSchema);
    const statuses = await ChicagoStatus.find({});

    console.log(`Found ${statuses.length} statuses in Chicago DB`);

    // 2. Connect to Passport
    const passportConn = await mongoose.createConnection(passportUri).asPromise();
    const PassportStatus = passportConn.model('statuses', statusSchema);

    // 3. Upsert Statuses
    for (const status of statuses) {
        await PassportStatus.updateOne(
            { _id: status._id },
            { $set: status.toObject() },
            { upsert: true }
        );
    }

    console.log(`Synced ${statuses.length} statuses to Passport DB`);
    process.exit(0);
};

run().catch(err => console.error(err));

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const caseId = '69747c4df351955f7b88a663';

async function checkCase() {
    try {
        console.log("Connecting to DB:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        // We can't use the TS model directly easily without compiling, so we define a basic schema/model or use query
        const collection = mongoose.connection.collection('cases');

        // Try to find with string ID first
        let doc = await collection.findOne({ _id: new mongoose.Types.ObjectId(caseId) });

        if (!doc) {
            console.log("Case NOT FOUND by ObjectId.");
            // Try string?
            // doc = await collection.findOne({ _id: caseId });
        }

        if (doc) {
            console.log("Case FOUND:", JSON.stringify(doc, null, 2));
        } else {
            console.log("Case DEFINITELY NOT FOUND.");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

checkCase();

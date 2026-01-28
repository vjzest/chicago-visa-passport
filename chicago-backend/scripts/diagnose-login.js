const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { createClient } = require('redis');
const { randomUUID } = require('crypto');

// Hardcoded for isolation
const mongoUri = 'mongodb+srv://azram:azram123@cluster0.bw18vwb.mongodb.net/chicagovisa?retryWrites=true&w=majority&appName=Cluster0';
const jwtSecret = process.env.JWT_SECRET || "secureVisa";
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Mock Admin Schema to avoid importing complex models that might have other dependencies
const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    authTokenVersion: { type: String, default: null },
    firstName: String,
    lastName: String,
    username: String,
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Roles' } // minimized
}, { strict: false });

const AdminsModel = mongoose.model('Admins', AdminSchema);

async function diagnoseLogin() {
    const redisClient = createClient({ url: redisUrl });
    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    try {
        console.log('--- DIAGNOSIS START (CommonJS) ---');
        await mongoose.connect(mongoUri);
        console.log('1. DB Connected');

        await redisClient.connect();
        console.log('2. Redis Connected');

        const email = 'musthafa@gmail.com';
        const admin = await AdminsModel.findOne({ email });

        if (!admin) {
            console.error('User not found!');
            process.exit(1);
        }
        console.log(`3. Found Admin: ${admin.email} (ID: ${admin._id})`);

        // Simulate SSO Login
        const newVersion = randomUUID();
        admin.authTokenVersion = newVersion;
        // We update using updateOne to avoid schema validation issues if local schema differs from DB
        await AdminsModel.updateOne({ _id: admin._id }, { $set: { authTokenVersion: newVersion } });
        console.log(`4. Updated authTokenVersion to: ${newVersion}`);

        // Simulate Cache Clear
        const key = `admin_${admin._id}`;
        await redisClient.del(key);
        console.log(`5. Cleared Redis Key: ${key}`);

        // Generate Token
        const token = jwt.sign(
            {
                id: admin._id,
                email: admin.email,
                role: "admin",
                tokenVersion: newVersion,
            },
            jwtSecret,
            { expiresIn: "1h" }
        );
        console.log('6. Generated JWT');

        // VERIFY: Can we find this user via Redis now? 
        console.log('--- SIMULATING MIDDLEWARE ---');
        let cachedAdminStr = await redisClient.get(key);
        console.log(`Cache check 1 (should be null): ${cachedAdminStr}`);

        if (!cachedAdminStr) {
            console.log('Cache miss. Fetching from DB...');
            const dbAdmin = await AdminsModel.findById(admin._id);

            console.log(`Fetched from DB. Version: ${dbAdmin.authTokenVersion}`);

            if (dbAdmin.authTokenVersion === newVersion) {
                console.log('SUCCESS: Versions match! Backend logic is sound.');

                // Re-populate cache to simulate full cycle
                await redisClient.set(key, JSON.stringify(dbAdmin), { EX: 3600 });
                console.log('Simulated caching done.');

            } else {
                console.error(`FAIL: Version mismatch! Token: ${newVersion}, DB: ${dbAdmin.authTokenVersion}`);
            }
        } else {
            console.error('FAIL: Cache was not cleared! redisClient.del() failed?');
        }

        console.log('--- DIAGNOSIS COMPLETE ---');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        await redisClient.disconnect();
    }
}

diagnoseLogin();

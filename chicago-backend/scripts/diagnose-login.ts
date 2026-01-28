import mongoose from 'mongoose';
import { AdminsModel } from '../models/admins.model';
import { redisClient } from '../config/redis';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import ENV from '../utils/lib/env.config';

// Force load envs if needed, or rely on pre-loaded if running with ts-node -r dotenv/config
const mongoUri = 'mongodb+srv://azram:azram123@cluster0.bw18vwb.mongodb.net/chicagovisa?retryWrites=true&w=majority&appName=Cluster0';
const jwtSecret = process.env.JWT_SECRET || "secureVisa";

async function diagnoseLogin() {
    try {
        console.log('--- DIAGNOSIS START ---');
        await mongoose.connect(mongoUri);
        console.log('1. DB Connected');

        await redisClient.connect();
        console.log('2. Redis Connected');

        const email = 'musthafa@gmail.com';
        const admin = await AdminsModel.findOne({ email });

        if (!admin) {
            console.error('User not found!');
            return;
        }
        console.log(`3. Found Admin: ${admin.email} (ID: ${admin._id})`);

        // Simulate SSO Login
        const newVersion = randomUUID();
        admin.authTokenVersion = newVersion;
        await admin.save();
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
        // The middleware does: get(key) -> null -> fetch DB -> set(key) -> check version

        // Simulate Middleware Check
        console.log('--- SIMULATING MIDDLEWARE ---');
        let cachedAdminStr = await redisClient.get(key);
        console.log(`Cache check 1 (should be null): ${cachedAdminStr}`);

        if (!cachedAdminStr) {
            console.log('Cache miss. Fetching from DB...');
            const dbAdmin = await AdminsModel.findById(admin._id);

            if (!dbAdmin) {
                console.error('CRITICAL: User gone from DB?');
            } else {
                console.log(`Fetched from DB. Version: ${dbAdmin.authTokenVersion}`);
                // Simulate caching
                await redisClient.set(key, JSON.stringify(dbAdmin), { EX: 3600 });
                console.log('Cached to Redis.');

                if (dbAdmin.authTokenVersion === newVersion) {
                    console.log('SUCCESS: Versions match!');
                } else {
                    console.error(`FAIL: Version mismatch! Token: ${newVersion}, DB: ${dbAdmin.authTokenVersion}`);
                }
            }
        } else {
            console.error('FAIL: Cache was not cleared!');
        }

        // Double Check: Verify subsequent request works from cache
        console.log('--- SIMULATING REQUEST 2 (Cached) ---');
        cachedAdminStr = await redisClient.get(key);
        if (cachedAdminStr) {
            const cachedAdmin = JSON.parse(cachedAdminStr);
            console.log(`Cache hit. Version in Cache: ${cachedAdmin.authTokenVersion}`);

            if (cachedAdmin.authTokenVersion === newVersion) {
                console.log('SUCCESS: Cached version matches!');
            } else {
                console.error(`FAIL: Cached version stale!`);
            }
        } else {
            console.error('FAIL: Cache should be populated now.');
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

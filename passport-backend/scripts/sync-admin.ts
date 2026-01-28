import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as readline from 'readline';

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

// Schemas (Simplified for copying)
const roleSchema = new mongoose.Schema({}, { strict: false });
const adminSchema = new mongoose.Schema({}, { strict: false });

const run = async () => {
    const getEmail = () => new Promise<string>((resolve) => {
        if (process.argv[2]) {
            resolve(process.argv[2].trim());
        } else {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Enter Chicago Admin Email to sync: ', (email) => {
                rl.close();
                resolve(email.trim());
            });
        }
    });

    const email = await getEmail();

    console.log(`Syncing admin: ${email}...`);

    // 1. Connect to Chicago
    const chicagoConn = await mongoose.createConnection(chicagoUri).asPromise();
    console.log("Connected to Chicago DB");

    const ChicagoAdmin = chicagoConn.model('admins', adminSchema);
    const ChicagoRole = chicagoConn.model('roles', roleSchema);

    // @ts-ignore - Mongoose typing issue with strict: false schemas
    const admin: any = await ChicagoAdmin.findOne({ email });
    if (!admin) {
        console.error("Admin not found in Chicago DB!");
        process.exit(1);
    }
    console.log("Found Admin:", admin._id);

    const role: any = await ChicagoRole.findById(admin.get('role') as string);
    if (!role) {
        console.error("Role not found for admin!");
        process.exit(1);
    }
    console.log("Found Role:", role._id);

    // 2. Connect to Passport
    const passportConn = await mongoose.createConnection(passportUri).asPromise();
    console.log("Connected to Passport DB");

    const PassportAdmin = passportConn.model('admins', adminSchema);
    const PassportRole = passportConn.model('roles', roleSchema);

    // 3. Upsert Role
    await PassportRole.updateOne(
        { _id: role._id },
        { $set: role.toObject() },
        { upsert: true }
    );
    console.log("Synced Role");

    // 4. Upsert Admin
    await PassportAdmin.updateOne(
        { _id: admin._id },
        { $set: admin.toObject() },
        { upsert: true }
    );
    console.log("Synced Admin");

    console.log("Done! You can now switch to Passport mode without login.");
    process.exit(0);
};

run().catch(err => console.error(err));

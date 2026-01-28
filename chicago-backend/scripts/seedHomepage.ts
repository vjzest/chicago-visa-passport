import mongoose from 'mongoose';
import HomepageContent from '../models/data.model';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbUri = process.env.MONGO_URI;

if (!dbUri) {
    console.error('❌ MONGO_URI is not defined in your .env file. Please check the .env file path in your script.');
    process.exit(1);
}

mongoose.connect(dbUri)
    .then(() => console.log('Database connected for seeding...'))
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });

const seedDatabase = async () => {
    try {
        await HomepageContent.deleteMany({});
        console.log('Old homepage content deleted.');

        const filePath = path.join(__dirname, './initialContent.json');
        if (!fs.existsSync(filePath)) {
            console.error(`❌ initialContent.json not found in the scripts folder.`);
            return;
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        await HomepageContent.create(data);
        console.log('✅ Homepage content has been successfully seeded!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

mongoose.connection.once('open', () => {
    seedDatabase();
});
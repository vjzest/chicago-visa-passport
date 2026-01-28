const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://azram:azram123@cluster0.bw18vwb.mongodb.net/chicagovisa?retryWrites=true&w=majority&appName=Cluster0';

async function listRoles() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to Chicago Visa DB');

        const roles = await mongoose.connection.db.collection('roles').find({}, { projection: { title: 1, _id: 1 } }).toArray();

        console.log('--- ROLES ---');
        roles.forEach(r => {
            console.log(`Role: "${r.title}" (ID: ${r._id})`);
        });
        console.log('-------------');

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

listRoles();

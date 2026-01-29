const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://azram:azram123@cluster0.bw18vwb.mongodb.net/passporteasy?retryWrites=true&w=majority&appName=Cluster0';

async function checkRoles() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB (Passport Backend)');

        const roles = await mongoose.connection.db.collection('roles').find({}).toArray();
        console.log('Total roles:', roles.length);
        roles.forEach(r => {
            console.log('Full Role Object:', JSON.stringify(r, null, 2));
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkRoles();

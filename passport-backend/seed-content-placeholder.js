const fs = require('fs');
const path = require('path');

// Adjusted path to point to chicago-visa/src/en.json
// Note: We are in passport-backend/
const jsonPath = path.join('..', 'chicago-visa', 'src', 'en.json');
const apiUrl = 'http://localhost:4001/api/v1/admin/content';

async function seed() {
    try {
        if (!fs.existsSync(jsonPath)) {
            console.error('Error: File not found at', jsonPath);
            return;
        }

        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        const jsonData = JSON.parse(rawData);

        // Depending on the controller, it might expect { data: ... } or just the object.
        // admin.content.controller.ts updateContent usually expects req.body.data IS the object 
        // OR req.body IS the object.

        // Let's check the controller first? 
        // Actually, I'll try sending { usPassportPage: ... } wrapped in a data property first if it fails.
        // But usually updateContent acts as a replace.
        // Wait, let's verify the controller code first to be sure.

        // Changing plan: I will view the controller first.
    } catch (e) { console.error(e) }
}

const fs = require('fs');
const path = require('path');

// Adjusted path to point to chicago-visa/src/en.json
const jsonPath = path.join('..', 'chicago-visa', 'src', 'en.json');
const apiUrl = 'http://127.0.0.1:8002/api/v1/admin/homepage';

// Mock an admin token if needed, but the middleware might bypass it or we might need to login first.
// Looking at admin.contentRoutes.ts, it uses 'adminAuthMiddleware'.
// We might need to bypass auth or generate a token. 
// For now, let's try without auth and see if it fails (401/403). 
// If it fails, we'll need to login as admin first or temporarily disable middleware.

async function seed() {
    try {
        if (!fs.existsSync(jsonPath)) {
            console.error('Error: File not found at', jsonPath);
            return;
        }

        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        // Ensure it's valid JSON
        const jsonData = JSON.parse(rawData);

        // The controller expects req.body.data to be a STRINGIFIED JSON.
        const payload = {
            data: JSON.stringify(jsonData)
        };

        console.log('Read data from:', jsonPath);
        console.log('Sending data to:', apiUrl);

        // Note: If adminAuthMiddleware is active, this request will likely fail with 401.
        // We might need to login first.

        // Attempting to login first to get a token? 
        // Or we can try to disable the middleware temporarily if the user allows, 
        // but better to just try and see the error.

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ...' // If needed
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Successfully seeded content!');
            // console.log(result);
        } else {
            console.error('Failed to seed content:', response.status, response.statusText);
            const text = await response.text();
            console.error('Response:', text);
        }
    } catch (error) {
        console.error('Error seeding content:', error);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

seed();

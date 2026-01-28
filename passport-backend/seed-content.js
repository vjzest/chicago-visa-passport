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

    // The controller expects req.body.data to be the content object.
    const payload = {
      data: jsonData
    };

    console.log('Read data from:', jsonPath);
    console.log('Sending data to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Successfully seeded content to Passport Backend!');
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

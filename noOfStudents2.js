const fs = require('fs');

// Read the JSON file
fs.readFile('./json/students2.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    try {
        // Parse JSON data
        const jsonData = JSON.parse(data);
        //console.log(jsonData[0].university);
        // Object to store total students per district
        const districtStudents = {};

        // if (Array.isArray(jsonData) && jsonData.length > 0) {
        //     // Fetch the first university
        //     const firstUniversity = jsonData[0];
        //     console.log('First university:', firstUniversity);
        // } else {
        //     console.error('JSON data is not in the expected format or is empty.');
        // }

        // Iterate through each university data
        jsonData.forEach(university => {
            const district = university.district;
            const students = university.students;

            // Accumulate students for each district
            if (district in districtStudents) {
                districtStudents[district] += students;
            } else {
                districtStudents[district] = students;
            }
        });

        // Print the result
        for (const district in districtStudents) {
            console.log(`District: ${district}, Total Students: ${districtStudents[district]}`);
        }
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});

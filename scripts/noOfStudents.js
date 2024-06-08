//This code is used to find the number of students in each district. 

const fs = require('fs');

fs.readFile('./data/students2.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        const districtStudents = {};

        jsonData.forEach(university => {
            const district = university.district;
            const students = university.students;

            if (district in districtStudents) {
                districtStudents[district] += students;
            } else {
                districtStudents[district] = students;
            }
        });

        for (const district in districtStudents) {
            console.log(`District: ${district}, Total Students: ${districtStudents[district]}`);
        }
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});

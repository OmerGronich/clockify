const axios = require('axios');
const moment = require('moment');
require('dotenv').config()


// Your Clockify API key
const API_KEY = process.env.API_KEY;
const WORKSPACE_ID = process.env.WORKSPACE_ID;
const USER_ID = process.env.USER_ID;
const PROJECT_ID = process.env.PROJECT_ID;


// payload for each entry
const payload = {
    "billable": true,
    "description": "",
    "projectId": PROJECT_ID,
    "taskId": null,
    "tagIds": [],
    "customFields": []
}

// These are offset for UTC, will actually be 9 to 18
const startTime = '07:00';
const endTime = '16:00';

// Create a new Clockify client
const clockify = axios.create({
    baseURL: 'https://global.api.clockify.me/v1',
    headers: { 'X-Api-Key': API_KEY },
});

// // Get the current month and year
const currentMonth = moment().format('MM');
const currentYear = moment().format('YYYY');

// Get the number of days in the current month
const daysInMonth = moment(`${currentYear}-${currentMonth}`, 'YYYY-MM').daysInMonth();

// Loop through each day of the month
for (let day = 1; day <= daysInMonth; day++) {
    // Get the date in the format YYYY-MM-DD
    const date = moment(`${currentYear}-${currentMonth}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD');

    // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = moment(date, 'YYYY-MM-DD').day();

    // Check if the current day is a weekday (Sunday to Thursday)
    if (dayOfWeek >= 0 && dayOfWeek <= 4) {
        // Add the time entry for the current day
        clockify
            .post(`/workspaces/${WORKSPACE_ID}/user/${USER_ID}/time-entries`, {
                ...payload,
                start: `${date}T${startTime}:00.000Z`,
                end: `${date}T${endTime}:00.000Z`,
            })
            .then(response => {
                console.log(`Successfully added time entry for ${date}.`, {response});
            })
            .catch(err => {
                console.error(`Error adding time entry for ${date}: ${err}`);
            });
    }
}
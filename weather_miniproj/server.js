require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();

const PORT = process.env.PORT || 3000;
const LATITUDE = process.env.LATITUDE;
const LONGITUDE = process.env.LONGITUDE;

let cachedData = null;
let lastFetchTime = null;
const CACHE_DURATION = 60 * 1000; // 60s

app.get('/weather', async (req, res) => {

    try {
        const now = Date.now();
        
        if (
            cachedData &&
            lastFetchTime &&
            (now - lastFetchTime < CACHE_DURATION)
        ) {

            console.log('Serving cached data');

            return res.json(cachedData);
        }
        
        console.log('Fetching fresh data from API');


        const response = await axios.get(
            'https://api.open-meteo.com/v1/forecast',
            {
                params: {
                    latitude: LATITUDE,
                    longitude: LONGITUDE,
                    hourly: 'temperature_2m,relative_humidity_2m'
                }
            }
        );

        const hourly = response.data.hourly;

        const transformedData = hourly.time.map((time, index) => ({
            time: time,
            temperature: hourly.temperature_2m[index],
            humidity: hourly.relative_humidity_2m[index]
        }));

        cachedData = transformedData;
        lastFetchTime = now;

        res.json(transformedData);

    } catch (error) {

        console.error('API Error:', error.message);

        res.status(500).json({
            error: 'Failed to fetch weather data'
        });

    }

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
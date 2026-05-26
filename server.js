const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.get('/weather', async (req, res) => {

    try {

        const response = await axios.get(
            'https://api.open-meteo.com/v1/forecast',
            {
                params: {
                    latitude: 1.29,
                    longitude: 103.85,
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

        res.json(transformedData);

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            error: 'Failed to fetch weather data'
        });

    }

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
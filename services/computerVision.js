const axios = require('axios');
const { apiKey, endpoint } = require('../config/azureConfig');

const analyzeImage = async (imageBuffer) => {
    try {
        const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Tags,Description`;

        const response = await axios.post(url, imageBuffer, {
            headers: {
                "Ocp-Apim-Subscription-Key": apiKey,
                "Content-Type": "application/octet-stream"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error al consumir el servicio Computer Vision:", error.message);
        if (error.response) {
            console.error("Detalles del error:", error.response.data);
        }
        throw error;
    }
};

module.exports = { analyzeImage };

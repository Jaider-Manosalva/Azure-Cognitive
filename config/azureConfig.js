require('dotenv').config();

module.exports = {
    apiKey: process.env.AZURE_API_KEY,
    endpoint: process.env.AZURE_ENDPOINT
};

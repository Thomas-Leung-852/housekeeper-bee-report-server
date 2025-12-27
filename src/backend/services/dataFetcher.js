import axios from 'axios';
import https from 'https';

export async function fetchData(apiUrl, apiKey, sessionToken) {
  try {

    // Create an https agent that bypasses SSL verification
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false // Bypass SSL verification
    });

    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Housekeeper-Report-Server/1.0',
        'x-api-key': `${apiKey}`,
        'x-session-token': `${sessionToken}`
      }, httpsAgent: httpsAgent 
    });
    return response.data;
  } catch (error) {
    //console.error('Error fetching data from API:', error.message);
    throw new Error(`(Error Code:9999) Failed to fetch data from ${apiUrl}: ${error.message}`);
  }
}
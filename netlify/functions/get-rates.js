exports.handler = async function(event) {
    const API_KEY = process.env.API_KEY;
    const { base = 'SGD' } = event.queryStringParameters;
    
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`);
        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to fetch rates',
                fallback: true 
            })
        };
    }
};

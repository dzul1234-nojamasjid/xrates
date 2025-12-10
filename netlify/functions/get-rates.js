exports.handler = async function(event) {
    const { base = 'SGD' } = event.queryStringParameters;
    
    try {
        // ========== FREE API - NO CREDITS NEEDED ==========
        // Using open.exchangerate-api.com (FREE, no API key needed)
        const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
        // ========== END FREE API ==========
        
        const data = await response.json();
        
        if (data.result !== 'success') {
            throw new Error('API returned error');
        }
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                conversion_rates: data.rates,
                base_code: base,
                time_last_update_utc: data.time_last_update_utc
            })
        };
    } catch (error) {
        // Fallback to static rates if API fails
        const fallbackRates = {
            SGD: { SGD: 1, MYR: 3.1807, IDR: 11286.57, SAR: 2.79, USD: 0.74 },
            MYR: { MYR: 1, SGD: 0.3145, IDR: 3560.25, SAR: 0.88, USD: 0.234 },
            IDR: { IDR: 1, SGD: 0.0000886, MYR: 0.000281, SAR: 0.000247, USD: 0.000066 },
            SAR: { SAR: 1, SGD: 0.358, MYR: 1.137, IDR: 4052.12, USD: 0.267 },
            USD: { USD: 1, SGD: 1.351, MYR: 4.285, IDR: 15280.50, SAR: 3.75 }
        };
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                conversion_rates: fallbackRates[base] || fallbackRates.SGD,
                base_code: base,
                fallback: true,
                message: 'Using fallback rates'
            })
        };
    }
};

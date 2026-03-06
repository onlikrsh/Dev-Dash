export async function fetchWithRetry(url, options = {}, retries = 3){
    for (let attempt = 0; attempt<retries; attempt++){
        try{
            // Set up a timeout (8 seconds)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            // Make the request (with timeout attached)
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            // If Request succeeded then clear the timeout
            clearTimeout(timeoutId);

            // Check if server returned an error (404, 500, etc.)
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse JSON and return
            return await response.json();

        }catch(error){
            // Check for no.of attempts with retries left
            if(attempt === retries - 1){
                throw error;
            }

            // Wait before retrying: 1s ->  2s ->  4s (EXPONENTIAL BACKOFF)
            const waitTime = 1000 * Math.pow(2, attempt);
            console.warn(`Attempt ${attempt + 1} failed. Retrying in ${waiTime}ms..`);

            // sleep for 2 seconds and then continue
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}
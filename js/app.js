import { initClock } from "./widgets/clock.js";
import { initWeather } from "./widgets/weather.js";

async function init(){
    initClock();

    await Promise.allSettled([
        initWeather()
    ]);

    console.log('DevDash Initialized✅')
}


document.addEventListener('DOMContentLoaded', init)
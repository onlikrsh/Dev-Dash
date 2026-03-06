import { initClock } from "./widgets/clock.js";
import { initGithub } from "./widgets/github.js";
import { initWeather } from "./widgets/weather.js";

async function init(){
    initClock();

    await Promise.allSettled([
        initWeather(),
        initGithub()
    ]);

    console.log('DevDash Initialized✅')
}


document.addEventListener('DOMContentLoaded', init)
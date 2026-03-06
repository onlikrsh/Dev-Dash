import { qs } from '../utils/dom.js';
import {save, load} from '../utils/storage.js';
import { fetchWithRetry } from '../services/api.js'
import CONFIG from '../config.js'

const contentEl = qs(".weather-main");
const detailEl = qs(".weather-detail");

const API_KEY = CONFIG.WEATHER_API_KEY;
const city = CONFIG.WEATHER_CITY;

function kelvinToCelsicus(kelvin){
    return Math.round(kelvin - 273.15);
}

function renderWeather(data){
    const temp = kelvinToCelsicus(data.main.temp);
    const city = data.name;

    contentEl.innerHTML = `
        <div class="temp-display">${temp}°</div>
        <svg class="weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    `;

     detailEl.innerHTML = `
        <span class="token-key">loc</span>: <span class="token-string">"${city}"</span>
    `;
}

function renderError(message){
     detailEl.innerHTML = `<span class="widget-error">${message}</span>`;
}

export async function initWeather(){
    const cached = load('devdash_weather');
    if(cached){
        renderWeather(cached);
    }

    try {
        // const city = load('weather_city', city);
        const data = await fetchWithRetry(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        )

        renderWeather(data)
        save('devdash_weather', data)

    } catch (error) {
        console.error(`Weather Fetch Failed: `, error);
        if(!cached){
            renderError(`Could not load weather!`);
        }
    }

}
import { qs } from "../utils/dom.js";


let timeEl = qs("#clock-time");
let dateEl = qs("#clock-date");


const timeFormatter = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
});

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

function updateClock(){
    const now = new Date();
    timeEl.textContent = timeFormatter.format(now);
    dateEl.textContent = dateFormatter.format(now);

}



export function initClock(){
    updateClock();
    setInterval(updateClock, 1000)
}
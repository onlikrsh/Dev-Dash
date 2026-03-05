import { initClock } from "./widgets/clock.js";

function init(){
    initClock();

    console.log('DevDash Initialized✅')
}


document.addEventListener('DOMContentLoaded', init)
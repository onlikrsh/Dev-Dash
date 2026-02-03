import { initBookmarks } from "./widgets/bookmarks.js";
import { initClock } from "./widgets/clock.js";
import { initGithub } from "./widgets/github.js";
import { initNotes } from "./widgets/notes.js";
import { initPomodoro } from "./widgets/pomodoro.js";
import { initWeather } from "./widgets/weather.js";

async function init(){
    initClock();
    initPomodoro();
    initBookmarks();
    initNotes();

    await Promise.allSettled([
        initWeather(),
        initGithub()
    ]);

    console.log('DevDash Initialized✅')
}


document.addEventListener('DOMContentLoaded', init)
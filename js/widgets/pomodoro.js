import { qs } from '../utils/dom.js'
import { save,load } from '../utils/storage.js'

const displayEl = qs('#pomo-display');
const toggleBtn = qs('#pomo-toggle');
const resetBtn = qs('#pomo-reset');

const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;

const PAUSE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="16" height="16"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let timeLeft = FOCUS_TIME;
let timerId = null;
let isFocusMode = true;
let sessionsCompleted = load('devdash_pomo_sessions', 0);

function formatTime(seconds){
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`;
}

function render() {
    displayEl.textContent = formatTime(timeLeft);
}

function tick() {
    timeLeft--;
    render()

    if(timeLeft <= 0){
        clearInterval(timerId);
        timerId = null;
        toggleBtn.innerHTML = PLAY_ICON;
    }

    if(isFocusMode){
        sessionsCompleted++;
        save('devdash_pomo_sessions', sessionsCompleted);
        isFocusMode = false;
        timeLeft = BREAK_TIME;
        render();

        if(Notification.permission === 'granted'){
            new Notification('DevDash', {body: `Focus Session complete! Take a break.`});
        } else {
            isFocusMode = true;
            timeLeft = FOCUS_TIME;
            render()
        }
    }
    
}

function handleToggle() {
    if(timerId) {
        clearInterval(timerId);
        timerId = null;
        toggleBtn.innerHTML = PLAY_ICON;
    } else {
        toggleBtn.innerHTML = PAUSE_ICON;
        timerId = setInterval(tick, 1000);
    }
}

function handleReset() {
    if(timerId) clearInterval(timerId);
    timerId = null;
    isFocusMode = true;
    timeLeft = FOCUS_TIME;
    toggleBtn.innerHTML = PLAY_ICON;
    render();
}

export function initPomodoro() {
    if('Notification' in window && Notification.permission === 'default'){
        Notification.requestPermission();
    }

    toggleBtn.addEventListener('click', handleToggle);
    resetBtn.addEventListener('click', handleReset);

    render();
}
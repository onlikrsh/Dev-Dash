import { qs } from '../utils/dom.js'
import { save,load } from '../utils/storage.js'

const displayEl = qs('#pomo-display');
const toggleBtn = qs('#pomo-toggle');
const resetBtn = qs('#pomo-reset');

const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;

const PAUSE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="16" height="16"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;


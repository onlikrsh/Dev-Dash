import { qs } from '../utils/dom.js';
import { save,load } from '../utils/storage.js';

const notesInput = qs('#notes-input');

function debounce(fn, delay){
    let timer;
    return function(...args){
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function saveNotes(){
    save('devdash_notes', notesInput.value);
}

const debouncedSave = debounce(saveNotes, 500);

export function initNotes(){
    const savedNotes = load('devdash_notes', '');
    notesInput.value = savedNotes;

    notesInput.addEventListener('input', debouncedSave);

    window.addEventListener('beforeunload', saveNotes);
}
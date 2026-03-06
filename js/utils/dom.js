// Shortcut for querySlector
export function qs(selector){
    return document.querySelector(selector);
}

export function qsa(selector){
    return document.querySelectorAll(selector)
}

// Shortcut for creating HTML elements with classes and text
export function createElement(tag, className='', textContent=''){
    const el = document.createElement(tag);
    if(className){
        el.className = className;
    }
    if(textContent){
        el.textContent = textContent;
    }
    return el;
}

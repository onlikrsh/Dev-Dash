// Shortcut for querySlector
export function qs(selector){
    return document.querySelector(selector);
}

export function qs(selector){
    return document.querySelectorAll(selector)
}

// Shortcut for creating HTML elements with classes and text
export function createElement(tag, classname='', textContent=''){
    const el = document.createElement(tag);
    if(classname){
        el.classname = classname;
    }
    if(textContent){
        el.textContent = textContent;
    }
    return el;
}

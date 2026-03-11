import { qs } from '../utils/dom.js';
import { save, load } from '../utils/storage.js';

const listEl = qs('#bookmarks-list');
const urlInput = qs('#bookmark-url');
const nameInput = qs('#bookmark-name');
const addBtn = qs('#bookmark-add-btn');

const DEFAULT_BOOKMARKS = [
    { id: 1, name: 'Hacker News', url: 'https://news.ycombinator.com', abbr: 'HN', color: 'var(--accent-orange)' },
    { id: 2, name: 'GitHub Issues', url: 'https://github.com', abbr: 'GH', color: 'var(--text-primary)' },
    { id: 3, name: 'MDN Docs', url: 'https://developer.mozilla.org', abbr: 'MD', color: 'var(--accent-blue)' },
    { id: 4, name: 'Music for Programming', url: 'https://musicforprogramming.net', abbr: 'YT', color: '#E11D48' },
];

let bookmarks = load('devdash_bookmarks', DEFAULT_BOOKMARKS);

function generateId() {
    return Date.now();
}

function getAbbr(name) {
    return name.slice(0, 2).toUpperCase();
}

function getColor(name) {
    const colors = ['var(--accent-orange)', 'var(--accent-blue)', 'var(--accent-green)', '#E11D48', 'var(--text-primary)'];
    const hash = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

function renderBookmarks() {
    listEl.innerHTML = '';

    bookmarks.forEach(bookmark => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="${bookmark.url}" target="_blank" rel="noopener" class="bookmark-item" data-id="${bookmark.id}">
                <div class="bookmark-icon" style="color: ${bookmark.color || getColor(bookmark.name)}">
                    ${bookmark.abbr || getAbbr(bookmark.name)}
                </div>
                <span>${bookmark.name}</span>
                <button class="bookmark-delete" data-id="${bookmark.id}" aria-label="Delete bookmark">✕</button>
            </a>
        `;
        listEl.appendChild(li);
    });
}

function addBookmark() {
    const url = urlInput.value.trim();
    const name = nameInput.value.trim();

    if (!url) {
        urlInput.focus();
        return;
    }

    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    bookmarks.push({
        id: generateId(),
        name: name || url,
        url: fullUrl,
        abbr: getAbbr(name || url),
        color: getColor(name || url)
    });

    save('devdash_bookmarks', bookmarks);
    renderBookmarks();

    urlInput.value = '';
    nameInput.value = '';
    urlInput.focus();
}


function deleteBookmark(id) {
    bookmarks = bookmarks.filter(b => b.id !== id);
    save('devdash_bookmarks', bookmarks);
    renderBookmarks();
}

export function initBookmarks() {
    renderBookmarks();

    addBtn.addEventListener('click', addBookmark);


    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addBookmark();
    });
    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') nameInput.focus();
    });

    listEl.addEventListener('click', (event) => {
        const deleteBtn = event.target.closest('.bookmark-delete');
        if (deleteBtn) {
            event.preventDefault();  
            event.stopPropagation(); 
            const id = Number(deleteBtn.dataset.id);
            deleteBookmark(id);
        }
    });
}
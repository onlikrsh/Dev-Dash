import { qs, createElement } from "../utils/dom.js";
import { save, load } from "../utils/storage.js";
import { fetchWithRetry } from "../services/api.js";
import CONFIG from "../config.js";

const totalEl = qs('#github-total');
const streakEl = qs('#github-streak');
const langEl = qs('#github-lang');
const gridEl = qs('#contrib-grid');

function renderStats(userData, reposData) {
    // Safety check: Ensure elements exist before modifying
    if (!totalEl || !streakEl || !langEl) return;

    let totalStars = 0;
    for (let i = 0; i < reposData.length; i++) {
        totalStars += reposData[i].stargazers_count;
    }

    const langCounts = {};
    reposData.forEach(repo => {
        if (repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        }
    });

    const topLang = Object.entries(langCounts)
        .sort((a, b) => b[1] - a[1])[0];


    totalEl.textContent = userData.public_repos ? userData.public_repos.toLocaleString() : '--';
    streakEl.textContent = `${totalStars} days`; 
    langEl.textContent = topLang ? topLang[0] : '--';
}

function renderContribGraph() {
    if (!gridEl) return; 

    gridEl.innerHTML = '';

    for (let week = 0; week < 22; week++) {
        const col = createElement('div', 'graph-column');

        for (let day = 0; day < 7; day++) {
            const cell = createElement('div', 'cell');
            
            const rand = Math.random();
            if (rand > 0.8) cell.setAttribute('data-level', '4');
            else if (rand > 0.6) cell.setAttribute('data-level', '3');
            else if (rand > 0.4) cell.setAttribute('data-level', '2');
            else if (rand > 0.2) cell.setAttribute('data-level', '1');
            else cell.setAttribute('data-level', '0'); // FIX: Added base level for empty cells

            col.appendChild(cell);
        }
        gridEl.appendChild(col);
    }
}

function renderError() {
    if (totalEl) totalEl.textContent = '--';
    if (streakEl) streakEl.textContent = '--';
    if (langEl) langEl.textContent = '--';
}

export async function initGithub() {
    const username = CONFIG.GITHUB_USERNAME;

    renderContribGraph();

    const cached = load('devdash_github');
    if (cached) {
        renderStats(cached.user, cached.repos);
    }

    try {
        const [userResult, reposResult] = await Promise.allSettled([
            fetchWithRetry(`https://api.github.com/users/${username}`),
            fetchWithRetry(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
        ]);

        if (userResult.status === 'fulfilled' && reposResult.status === 'fulfilled') {
            renderStats(userResult.value, reposResult.value);
            save('devdash_github', {
                user: userResult.value,
                repos: reposResult.value
            });
        } else {
            throw new Error('GitHub API call failed');
        }
    } catch (error) {
        console.error('GitHub fetch failed:', error);
        if (!cached) renderError();
    }
}
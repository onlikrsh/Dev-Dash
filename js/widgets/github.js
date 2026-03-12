import { qs, createElement } from "../utils/dom.js";
import { save, load } from "../utils/storage.js";
import { fetchWithRetry } from "../services/api.js";
import CONFIG from "../config.js";

const totalEl = qs('#github-total');
const streakEl = qs('#github-streak');
const langEl = qs('#github-lang');
const gridEl = qs('#contrib-grid');
let target = qs(".target");

// target.addEventListener("dragover", (ev) => {
//   ev.preventDefault();
// });
// target.addEventListener("drop", (ev) => {
  
// });


// grid-column: span 2;
// grid-row: span 1;

function calculateStreak(contributions) {
    let streak = 0;
    // Loop backwards from today
    for (let i = contributions.length - 1; i >= 0; i--) {
        if (contributions[i].count > 0) {
            streak++;
        } else if (i < contributions.length - 1) {
            // If the count is 0, and it's not today, the streak is broken
            break; 
        }
    }
    return streak;
}

function renderStats(userData, reposData, contribData) {
    if (!totalEl || !streakEl || !langEl) return;

    // Calculate Top Language
    const langCounts = {};
    reposData.forEach(repo => {
        if (repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        }
    });
    const topLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0];

    totalEl.textContent = contribData.total.lastYear ? contribData.total.lastYear.toLocaleString() : '--';
    streakEl.textContent = `${calculateStreak(contribData.contributions)} days`; 
    langEl.textContent = topLang ? topLang[0] : '--';
}

function renderContribGraph(contributions) {
    if (!gridEl) return; 
    gridEl.innerHTML = '';

    // The API returns 365 days, 154 days only needed the last  to fill our 22 columns (22 * 7 = 154)
    const recentContributions = contributions.slice(-54)

    for (let week = 0; week < 22; week++) {
        const col = createElement('div', 'graph-column');

        for (let day = 0; day < 7; day++) {
            const index = (week * 7) + day;
            const cell = createElement('div', 'cell');
            
            if (recentContributions[index]) {
                cell.setAttribute('data-level', recentContributions[index].level);
                // Hover over a square to see the exact date and count
                cell.title = `${recentContributions[index].count} contributions on ${recentContributions[index].date}`;
            } else {
                cell.setAttribute('data-level', '0'); 
            }

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

    const cached = load('devdash_github');
    if (cached && cached.contribs) {
        renderStats(cached.user, cached.repos, cached.contribs);
        renderContribGraph(cached.contribs.contributions);
    }

    try {
        // Fetch User, Repos, AND Contributions simultaneously
        const [userResult, reposResult, contribResult] = await Promise.allSettled([
            fetchWithRetry(`https://api.github.com/users/${username}`),
            fetchWithRetry(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
            fetchWithRetry(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
        ]);

        if (userResult.status === 'fulfilled' && reposResult.status === 'fulfilled' && contribResult.status === 'fulfilled') {
            
            renderStats(userResult.value, reposResult.value, contribResult.value);
            renderContribGraph(contribResult.value.contributions);
            
            save('devdash_github', {
                user: userResult.value,
                repos: reposResult.value,
                contribs: contribResult.value
            });
        } else {
            throw new Error('One or more GitHub API calls failed');
        }
    } catch (error) {
        console.error('GitHub fetch failed:', error);
        if (!cached) renderError();
    }
}
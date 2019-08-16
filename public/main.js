const darkModeStyleSheet = './darkly.bootstrap.min.css';
const lightModeStyleSheet = './flatly.bootstrap.min.css';

const routes = [
    {
        id: 'homepage',
        name: 'Home',
        path: '/',
        source: 'pages/home.html'
    },
    {
        id: 'projects',
        name: 'Projects', 
        path: '/projects',
        source: 'pages/projects.html'
    },
    {
        id: 'resume',
        name: 'Résumé',
        path: '/resume',
        source: 'pages/resume.html'
    },
    {
        id: 'media',
        name: 'Media',
        path: '/media',
        source: 'pages/media.html'
    },
    {
        id: 'contact',
        name: 'Contact', 
        path: '/contact',
        source: 'pages/contact.html'
    },
]

function init() {
    console.log("Initializing Thomas' Website!");
    createNavItems();
    initializeEventListeners();
    initializeThemeSwitcher();
    cacheRouteContent();
}

function createNavItems() {
    let mainNavbar = document.getElementById("main-nav-bar");
    routes.forEach((route) => {
        let navItem = /*html*/`
            <li class="nav-item">
                <a id="${route.id}" class="nav-link">${route.name}</a>
            </li>
        `;
        mainNavbar.innerHTML += navItem;
    });
}

function initializeEventListeners() {
    routes.forEach((route) => {
        let navDomElement = document.getElementById(route.id);
        navDomElement.addEventListener("click", (event) => {
            loadPage(event.target.id);
        });
    })
}

function initializeThemeSwitcher() {
    let themeSwitcher = document.getElementById('sick-theme-switcher');
    themeSwitcher.addEventListener("click", () => {
        toggleDarkMode();
    })
}

function cacheRouteContent() {
    let promises = [];
    routes.forEach(function(route, index) {
        if (!route.module) {
            promises.push(fetch(route.source)
            .then(response => response.text())
            .then(text => {
                routes[index].content = text;
            }));
        } else {
            routes[index].content = route.module;
        }
    });
    Promise.all(promises).then(() => {
        loadPage(routes[0].id);
    });
}

function loadPage(id) {
    let pageContent = document.getElementsByClassName('page-content')[0];
    if (pageContent !== null) {
        let route = getRoute(id);
        // Only load the page if it's not already loaded.
        if (pageContent.id !== generateContainerId(route.id)) {
            pageContent.innerHTML = route.content;
            pageContent.id = generateContainerId(id);
        } else {
            console.log('Page is already loaded.')
        }
    } else {
        console.warn('Failed to find page-content in DOM. Noop.')
    }
}

function getRoute(id) {
    let route = routes.find(route => route.id === id);
    if (route === null || route === undefined) {
        console.log('Invalid page ID: ' + id + '. Reloading homepage.') 
        route = routes[0];
    } 
    return route;
}

function generateContainerId(id) {
    return id + '-container';
}

function toggleDarkMode() {
    let currentStyle = document.getElementById('bootstrap-stylesheet');
    if (currentStyle.getAttribute('href') !== darkModeStyleSheet) {
        currentStyle.setAttribute('href', darkModeStyleSheet);
    } else {
        currentStyle.setAttribute('href', lightModeStyleSheet);
    }
}

init();
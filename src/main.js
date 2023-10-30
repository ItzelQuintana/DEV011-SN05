import home from './home.js';
import renderLogin from './login.js';
import renderCreateAccount from './register.js';
import { posts } from './post.js';

const routes = [
  { path: '/', component: home },
  { path: '/login', component: renderLogin },
  { path: '/register', component: renderCreateAccount },
  { path: '/posts', component: posts },
];

let mainPage = document.querySelector('.homepage');
if (!mainPage) {
  const mainChild = document.createElement('div');
  mainChild.id = 'content';
  document.body.appendChild(mainChild);
  mainPage = mainChild;
}
const defaultRoute = '/';

function navigateTo(hash) {
  // Find the matching route
  const route = routes.find((r) => r.path === hash);

  // If the route exists, execute its component function
  if (route && route.component) {
    window.history.pushState(
      {},
      route.path,
      window.location.origin + route.path,
    );

    if (mainPage.firstChild) mainPage.removeChild(mainPage.firstChild);

    mainPage.append(route.component(navigateTo));
  } else {
    // Otherwise, redirect to the default route
    navigateTo('/error');

  }
}
// home(mainPage, navigateTo);
// renderLogin(navigateTo);
// renderCreateAccount(navigateTo);

window.addEventListener('popstate', () => {
  console.log('change');
  navigateTo(window.location.pathname);
});

function initRouter() {
  console.log('Initializing router...');
  navigateTo(window.location.pathname || defaultRoute);
}

// export default navigateTo;
initRouter();

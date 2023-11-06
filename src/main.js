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
  const route = routes.find((r) => r.path === hash);

  if (route && route.component) {
    window.history.pushState(
      {},
      route.path,
      window.location.origin + route.path,
    );

    if (mainPage.firstChild) {
      mainPage.removeChild(mainPage.firstChild);
      mainPage.append(route.component(navigateTo));
    } else {
      navigateTo('/error');
    }
  }
}

window.addEventListener('popstate', () => {
  console.log('change');
  navigateTo(window.location.pathname);
});

function initRouter() {
  console.log('Initializing router...');
  navigateTo(window.location.pathname || defaultRoute);
}

initRouter();
export default navigateTo;

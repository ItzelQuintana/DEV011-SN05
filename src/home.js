// estructura interna del contenedor
function home(navigateTo) {
  const mainPage = document.createElement('div');
  mainPage.setAttribute('class', 'homepage1');

  const containerimg = document.createElement('div');
  containerimg.className = 'containerimg';
  const img = document.createElement('img');
  img.src = 'img/planta-arana.png';
  img.id = 'homeplant';
  img.alt = 'Imagen de plantas';
  const content = document.createElement('div');
  content.className = 'content';

  const homewelcome = document.createElement('h3');
  homewelcome.className = 'homewelcome';
  homewelcome.textContent = 'Bienvenidos a :';

  const hometitle = document.createElement('h1');
  hometitle.className = 'hometittle';
  hometitle.textContent = 'Mi PlantApp';

  const words = document.createElement('p');
  words.className = 'words';
  words.textContent = 'Una gran comunidad de amantes de las plantas y botánica.';
  const orderbuttons = document.createElement('div');
  orderbuttons.className = 'orderbuttons';

  const registerButton = document.createElement('button');
  registerButton.className = 'registrationButton';
  registerButton.id = 'registerButton';
  registerButton.textContent = 'Registrarse';

  // evento para que se redirija a la vista de registro
  registerButton.addEventListener('click', () => {
    // renderCreateAccount(mainPage);
    // window.location = '/register';
    navigateTo('/register');
  });

  const wordsHome = document.createElement('p');
  wordsHome.className = 'wordsHome';
  wordsHome.textContent = '¿Ya tienes una cuenta?';

  const loginButton = document.createElement('button');
  loginButton.className = 'loginButton';
  loginButton.id = 'loginButton';
  loginButton.textContent = 'Iniciar Sesión';
  loginButton.addEventListener('click', () => {
    // renderLogin(mainPage);
    navigateTo('/login');
  });

  mainPage.appendChild(containerimg);
  containerimg.appendChild(img);
  mainPage.appendChild(content);
  content.appendChild(homewelcome);
  content.appendChild(hometitle);
  content.appendChild(words);
  content.appendChild(orderbuttons);
  orderbuttons.appendChild(registerButton);
  orderbuttons.appendChild(wordsHome);
  orderbuttons.appendChild(loginButton);
  return mainPage;
}

export default home;

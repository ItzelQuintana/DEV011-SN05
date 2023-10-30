import { createUser, GoogleRegister } from './firebase.js';


// para crear la vista de registro
function renderCreateAccount(navigateTo) {
  console.log('register router');
  const mainPage = document.createElement('div');
  mainPage.setAttribute('class', 'homepage1');

  // header
  const header = document.createElement('header');
  header.setAttribute('class', 'headerRegister');

  // Titulo de registro
  const title = document.createElement('h2');
  title.textContent = 'Para crear una nueva cuenta, ingresa tus datos.';
  // Imagen
  const image = document.createElement('img');
  image.setAttribute('src', 'img/evolucion.png');
  image.style.width = '60%';
  image.style.height = 'auto';

  // Contenedor de los inputs
  const container = document.createElement('div');
  container.setAttribute('class', 'Inputcontainer');
  // input Username
  const username = document.createElement('h4');
  username.textContent = 'Nombres completos:';
  username.setAttribute('class', 'h4Register');
  const inputName = document.createElement('input');
  inputName.setAttribute('type', 'text');
  inputName.setAttribute('class', 'input');
  // input correo
  const email = document.createElement('h4');
  email.textContent = 'Correo Electrónico:';
  email.setAttribute('class', 'h4Register');
  const inputEmail = document.createElement('input');
  inputEmail.setAttribute('type', 'email');
  inputEmail.setAttribute('class', 'input');
  inputEmail.setAttribute('id', 'emailRegister');

  // input contrasena
  const password = document.createElement('h4');
  password.textContent = 'Contraseña:';
  password.setAttribute('class', 'h4Register');
  const inputPassword = document.createElement('input');
  inputPassword.setAttribute('type', 'password');
  inputPassword.setAttribute('class', 'input');
  inputPassword.setAttribute('id', 'passwordRegister');
  // mensaje error contrasena
  const spanPassword = document.createElement('span');
  spanPassword.setAttribute('id', 'answerPass');

  // boton continuar
  const buttonContinue = document.createElement('button');
  buttonContinue.textContent = 'Continuar';
  buttonContinue.setAttribute('class', 'buttonRegister');
  buttonContinue.setAttribute('id', 'continue');
  // google boton
  const or = document.createElement('h4');
  or.textContent = 'o';
  or.setAttribute('id', 'or');
 // Boton Google
  const buttonGoogle = document.createElement('button');
  buttonGoogle.setAttribute('id', 'google')
  buttonGoogle.setAttribute('class', 'buttonRegister');
  const googleImg = document.createElement('img');
  googleImg.setAttribute('src', 'img/googleongpng.webp');
  googleImg.setAttribute('class', 'imgGoogle')
  const textButton = document.createElement('h2')
  textButton.textContent = 'Registrarse con Google';

  // Boton volver
  const buttonBack = document.createElement('button');
  buttonBack.textContent = 'Volver';
  buttonBack.setAttribute('class', 'buttonRegister');
  buttonBack.setAttribute('id', 'return');
  buttonBack.addEventListener('click', () => {
    navigateTo('/');
  });

  mainPage.append(header, container);
  header.append(title, image);
  buttonGoogle.append(googleImg, textButton);
  container.append(
    username,
    inputName,
    email,
    inputEmail,
    password,
    inputPassword,
    spanPassword,
    buttonContinue,
    or,
    buttonGoogle,
    buttonBack,
  );

  // continuar para registrar
  buttonContinue.addEventListener('click', (e) => {
    e.preventDefault();
    const signUpEmail = document.querySelector('#emailRegister').value;
    const signPassword = document.querySelector('#passwordRegister').value;
    // console.log(signUpEmail, signPassword);
    createUser(signUpEmail, signPassword)
      .then((ok) => {
        spanPassword.classList.add(ok.message);
        spanPassword.textContent = `${ok.message} ${ok.email} Saved`;
        navigateTo('/posts');
      })
      .catch((err) => {
        spanPassword.classList.add('error');
        spanPassword.textContent = `${err.message} ${err.email} Not saved`;
      });
  });

  // Con Google
  buttonGoogle.addEventListener('click', () => {
    GoogleRegister();
  });
  return mainPage;
}
export default renderCreateAccount;

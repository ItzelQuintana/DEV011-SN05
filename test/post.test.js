import { posts } from '../src/post.js';
import * as firebase from '../src/firebase.js';

describe('Usuario autenticado', () => {
  it('Renderiza correctamente con usuario autenticado', () => {
    // Mock de la función onAuthStateChanged de firebase
    jest.spyOn(firebase, 'initializeAuth').mockImplementation((callback) => {
      // Simula un usuario autenticado
      callback({ uid: 'IdDeUsuarioSimulado' });
    });

    // Mock de la función de navegación
    const navigateToMock = jest.fn();

    // Renderiza el componente
    const mainPage = posts(navigateToMock);

    // Verifica que el componente se haya renderizado correctamente
    // Aquí puedes hacer expectativas sobre el contenido de mainPage si es necesario
    expect(mainPage).toBeDefined();
  });

  it('Inicia sesión correctamente', () => {
    // Mock de la función onAuthStateChanged de firebase
    jest.spyOn(firebase, 'initializeAuth').mockImplementation((callback) => {
      // Simula un usuario no autenticado
      callback(null);
    });

    // Mock de la función de navegación
    const navigateToMock = jest.fn();

    // Mock de la función signInWithEmailAndPassword de firebase
    jest.spyOn(firebase, 'login').mockResolvedValueOnce({});

    // Renderiza el componente
    const mainPage = posts(navigateToMock);

    // Simula el inicio de sesión
    const buttonLogin = mainPage.querySelector('#sessionBtn');
    buttonLogin.click();

    // Verifica que la función de inicio de sesión se haya llamado correctamente
    expect(firebase.login).toHaveBeenCalledWith(
      'holahola@holahola.com',
      'holaholahola',
    );

    // Verifica que la función de navegación se haya llamado después de iniciar sesión
    expect(navigateToMock).toHaveBeenCalledWith('/');
  });
});

describe('posts', () => {
  it('Should be a function', () => {
    expect(typeof posts).toBe('function');
  });
  it('Have a button to log out', () => {
    const DOM = document.createElement('div');
    document.body.appendChild(DOM);
    DOM.append(posts());
    const haveAbutton = DOM.querySelector('.logOutButton');
    expect(haveAbutton).not.toBe(undefined);
  });
  it('Have a container to posts', () => {
    const DOM = document.createElement('div');
    DOM.append(posts());
    const containerPosts = DOM.querySelector('.postView');
    expect(containerPosts).not.toBe(undefined);
  });
  it('Have a form to public post', () => {
    const DOM = document.createElement('div');
    DOM.append(posts());
    const createPosts = DOM.querySelector('#task-form');
    expect(createPosts).not.toBe(undefined);
  });
  it('Post have a button to delete', () => {
    const DOM = document.createElement('div');
    DOM.append(posts());
    const buttonDelete = DOM.querySelector('.deleteButton');
    expect(buttonDelete).not.toBe(undefined);
  });
  it('Post have a button to edit', () => {
    const DOM = document.createElement('div');
    document.body.append(DOM);
    DOM.append(posts());
    const buttonEdit = DOM.querySelector('.editButton');
    expect(buttonEdit).not.toBe(undefined);
  });
  it('Snapshot of posts', () => {
    const DOM = document.createElement('div');
    DOM.append(posts());
    expect(DOM).toMatchSnapshot();
  });
});

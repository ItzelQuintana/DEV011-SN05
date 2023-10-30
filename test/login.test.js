/**
 * @jest-environment jsdom
 */
import renderLogin from '../src/login.js';
// import * as auth from '../src/firebase.js';

describe('renderLogin', () => {
  it('Should be a function', () => {
    expect(typeof renderLogin).toBe('function');
  });
  it('Have a button to return', () => {
    const DOM = document.createElement('div');
    DOM.append(renderLogin());
    const haveAbutton = DOM.querySelector('#return');
    expect(haveAbutton).not.toBe(undefined);
  });
  it('Have a button to login with Google', () => {
    const DOM = document.createElement('div');
    DOM.append(renderLogin());
    const haveAbuttonGoogle = DOM.querySelector('.googleLoginBtn');
    expect(haveAbuttonGoogle).not.toBe(undefined);
  });
  it('After click button return call function navigateTo /', () => {
    const DOM = document.createElement('div');
    const navigateTo = jest.fn();
    DOM.append(renderLogin(navigateTo));
    const haveAbuttonReturn = DOM.querySelector('#return');
    haveAbuttonReturn.click();
    expect(navigateTo).toHaveBeenLastCalledWith('/');
  });
//   it('Snapshot of login', () => {
//     const DOM = document.createElement('div');
//     DOM.append(renderLogin());
//     expect(DOM).toMatchSnapshot();
//   });
});

// describe('Button Iniciar Sesion', () => {
//   it('Test of click button save', () => {
//   jest.spyOn(auth, 'login').mockImplementation(() =>
//   Promise.resolve({ message: 'success', email: 'giselle@lopezcadenillas.com' }));
//   const DOM = document.createElement('div');
//   DOM.append(renderLogin());
//   const loginEmail = DOM.querySelector('#emailLog');
//   const loginPassword = DOM.querySelector('#passwordLogin');
//   loginEmail.value = 'giselle@lopezcadenillas.com';
//   loginPassword.value = 'hola12345';
//   const buttonSave = DOM.querySelector('#sessionBtn');
//   buttonSave.click();
//   expect(auth.login).toHaveBeenCalledTimes(2);
//   expect(auth.login).toHaveBeenCalledWidth('giselle@lopezcadenillas.com');
//   });
// });

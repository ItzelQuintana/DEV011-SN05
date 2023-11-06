/**
 * @jest-environment jsdom
 */

import { renderLogin } from '../src/login.js';
import { login } from '../src/firebase.js';

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
  it('Snapshot of login', () => {
    const DOM = document.createElement('div');
    DOM.append(renderLogin());
    expect(DOM).toMatchSnapshot();
  });
});

describe('Button Iniciar Sesion', () => {
  it('Test of login function', async () => {
    const result = await login('holahola@holahola.com', 'holaholahola');
    expect(result).toEqual({ message: 'success', email: 'holahola@holahola.com' });
  });
});
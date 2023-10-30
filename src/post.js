import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore, saveTask, handleLike } from './firebase.js';

export function posts(navigateTo) {
const homepage = document.querySelector('.homepage');
const body1 = document.querySelector('body');
const backgroundLayer = document.createElement('div');
backgroundLayer.classList.add('background-layer');

  homepage.style.boxShadow = '0px 0px 0px transparent';
  homepage.style.height = '100%';
  homepage.style.width = '100%'
  homepage.style.paddingTop = '0em'; 
  
    backgroundLayer.style.background = "url('/img/patron2.avif')";
    backgroundLayer.style.opacity = 0.1;
    backgroundLayer.style.zIndex = '-1';

    backgroundLayer.style.top = '0';
    backgroundLayer.style.left = '0';
    backgroundLayer.style.width = '100%';
    backgroundLayer.style.height = '100%';

  const mainPage = document.createElement('div');
  mainPage.setAttribute('class', 'homepagePosts');

  const headerPost = document.createElement('div');
  headerPost.textContent = 'Mi Plantapp';
  headerPost.setAttribute('class', 'headerPost');

  const logoImage = document.createElement('img');
  logoImage.setAttribute('src', '/img/planta-arana.png');
  logoImage.setAttribute('class', 'logoImage');
  
  const containerPubication = document.createElement('div');
  containerPubication.setAttribute('class', 'containerPubication');

  const imagePublication = document.createElement('img');
  imagePublication.setAttribute('src', '/img/mujer.png');
  imagePublication.setAttribute('class', 'imagePublication');

  const containerPost = document.createElement('form');
  containerPost.setAttribute('id', 'task-form');

  const postTitle = document.createElement('input');
  postTitle.setAttribute('type', 'text');
  postTitle.setAttribute('class', 'postTitle')
  postTitle.setAttribute('placeholder', 'Título de la publicación.');

  const post = document.createElement('textarea');
  post.setAttribute('placeholder', 'Ingresa el contenido de la publicación.');
  post.setAttribute('id', 'postText');

  const buttonSave = document.createElement('button');
  buttonSave.setAttribute('class', 'buttonSave');
  buttonSave.textContent = 'Publicar';

  // contenedor post
  const viewPost = document.createElement('div');
  viewPost.textContent = ' hola ';
  viewPost.setAttribute('class', 'postView');

  containerPost.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = postTitle.value;
    const description = post.value;
    // console.log(title, description);
    saveTask(title, description);

    containerPost.reset();
  });
  const buttonback = document.createElement('button');
  buttonback.textContent = 'back';
  buttonback.addEventListener('click', () => {
    navigateTo('/');
  
    backgroundLayer.style.opacity = 0.0;
    backgroundLayer.style.zIndex = '-1';
    backgroundLayer.style.top = '0';
    backgroundLayer.style.left = '0';
    backgroundLayer.style.width = '0%';
    backgroundLayer.style.height = '0%';

    homepage.style.boxShadow = '0 0 10px rgba(156, 158, 156, 0.346), 0 0 20px rgba(135, 136, 135, 0.5), 0 0 30px rgba(0, 255, 0, 0.203)';
    homepage.style.height = '90%';
    homepage.style.width = '90%'
    homepage.style.paddingTop = '0em'; 
  });

  function setupPost(data) {
    if (data.length) {
      let html = '';
      data.forEach((doc) => {
        const postdata = doc.data();
        html += `
    <li class="ListGroupItem">
    <h5>${postdata.title}</h5>
    <p>${postdata.description}</p>
    <button class="likeButton" data-post-id="${doc.id}">Like</button>
    <span>${postdata.likes} Likes</span>
    </li>
    `;
      });
      viewPost.innerHTML = html;
  
       // Añade un evento de clic al botón de "Like"
       const likeButtons = document.querySelectorAll('.likeButton');
       likeButtons.forEach((button) => {
         button.addEventListener('click', (e) => {
           const postId = e.target.getAttribute('data-post-id');
           handleLike(firestore, postId, ()=>{
            const userPostsCollection = collection(firestore, 'post');
            getDocs(userPostsCollection).then((snapshot) => {
              setupPost(snapshot.docs);
            });
          });
         });
       });
      }
       else {
      viewPost.innerHTML = '<p>Login to see posts</p>';
    }

  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Ahora user es el objeto de usuario autenticado
      // Puedes acceder a la colección de 'post' del usuario
      const userPostsCollection = collection(firestore, 'post');

      getDocs(userPostsCollection).then((snapshot) => {
        // snapshot.docs contiene los documentos de la colección
        setupPost(snapshot.docs);
        console.log(snapshot.docs);
      });
    } else {
      setupPost([]);
      console.log('Sign out');
    }
  });

  mainPage.append(headerPost, containerPubication, viewPost, buttonback);
  headerPost.append(logoImage);
  body1.appendChild(backgroundLayer);
  containerPubication.append(imagePublication, containerPost)
  containerPost.append(postTitle, post, buttonSave);
  return mainPage;
}

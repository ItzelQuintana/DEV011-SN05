import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  firestore,
  saveTask,
  handleLike,
  deletePost,
  editPost,
  logOut,
} from './firebase.js';

export function posts(navigateTo) {
  const homepage = document.querySelector('.homepage');
  const body1 = document.querySelector('body');
  const backgroundLayer = document.createElement('div');
  backgroundLayer.classList.add('background-layer');
  homepage.style.boxShadow = '0px 0px 0px transparent';
  homepage.style.height = '100%';
  homepage.style.width = '100%';
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
  // Boton cerrar sesion
  const logOutIcon = document.createElement('button');
  logOutIcon.setAttribute('class', 'logOutButton');
  //icono cerrar sesion
  const iconLogOut = document.createElement('img');
  iconLogOut.setAttribute('src', '/img/salir.png');
  // Contenedor de Creacion de post
  const containerPubication = document.createElement('div');
  containerPubication.setAttribute('class', 'containerPubication');
  // Imagen Post
  const imagePublication = document.createElement('img');
  imagePublication.setAttribute('src', '/img/mujer.png');
  imagePublication.setAttribute('class', 'imagePublication');
  // Formulario para la creacion de post
  const containerPost = document.createElement('form');
  containerPost.setAttribute('id', 'task-form');
  // Input titulo
  const postTitle = document.createElement('input');
  postTitle.setAttribute('type', 'text');
  postTitle.setAttribute('class', 'postTitle');
  postTitle.setAttribute('placeholder', 'Título de la publicación.');
  // Input descripcion
  const post = document.createElement('textarea');
  post.setAttribute('placeholder', 'Ingresa el contenido de la publicación.');
  post.setAttribute('id', 'postText');
  // Boton publicar
  const buttonSave = document.createElement('button');
  buttonSave.setAttribute('class', 'buttonSave');
  buttonSave.textContent = 'Publicar';
  // contenedor post
  const viewPost = document.createElement('div');
  viewPost.setAttribute('class', 'postView');
  containerPost.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = postTitle.value;
    const description = post.value;
    // console.log(title, description);
    saveTask(title, description);
    // console.log(auth.currentUser.uid);
    containerPost.reset();
  });

  function setupPost(data) {
    if (data.length) {
      let html = '';
      data.forEach((doc) => {
        const postdata = doc.data();
        html += `
    <li class="ListGroupItem">
    <div class='buttonOptions'>
    <button class='deleteButton' data-post-id="${doc.id}"> Delete </button>
    <button class='editButton' data-post-id="${doc.id}"> Editar </button>
    </div>
    <h5>${postdata.title}</h5>
    <p>${postdata.description}</p>
    <div class="containerLikes" data-post-id="${doc.id}">
    <button class="likeButton" data-post-id="${doc.id}">
    <img src="img/like.png" class='imgLike'>
    </button>
    <span>${postdata.likes} Likes</span>
    </div>
    <h4 class='editPublic' data-post-id="${doc.id}" style="display: none;"> Editar publicación: </h4>
    <textarea class="editTextarea" data-post-id="${doc.id}" style="display: none;">${postdata.title}</textarea>
    <textarea class="editContentTextarea" data-post-id="${doc.id}" style="display: none;">${postdata.description}</textarea>
    <button class="saveEditButton" data-post-id="${doc.id}" style="display: none;">Guardar</button>
    </li>
    `;
      });
      viewPost.innerHTML = html;

      // Evento Like
      // Evento Like
      const likeButtons = document.querySelectorAll('.likeButton');
      likeButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          const postId = e.currentTarget.getAttribute('data-post-id');
          const userId = auth.currentUser.uid; // Obtiene el id del usuario actual
          const isLiked = e.currentTarget.classList.contains('liked'); // Verifica si el botón ya ha sido "liked"
          // Cambiar el estado del botón "like" (colorear o quitar el color rojo)
          if (isLiked) {
            e.currentTarget.classList.remove('liked');
          } else {
            e.currentTarget.classList.add('liked');
          }
          handleLike(postId, userId, () => {
            // CallBack después de un like
            const userPostsCollection = collection(firestore, 'post');
            getDocs(userPostsCollection).then((snapshot) => {
              setupPost(snapshot.docs);
            });
          });
        });
      });

      // Evento Editar
      const editButtons = document.querySelectorAll('.editButton');
      editButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          const postId = e.currentTarget.getAttribute('data-post-id');
          const textareaTitle = document.querySelector(
            `.editTextarea[data-post-id="${postId}"]`
          );
          const textareaDescription = document.querySelector(
            `.editContentTextarea[data-post-id="${postId}"]`
          );
          const saveEditButton = document.querySelector(
            `.saveEditButton[data-post-id="${postId}"]`
          );
          const likeButton = document.querySelector(
            `.containerLikes[data-post-id="${postId}"]`
          );
          const descriptionEdit = document.querySelector(
            `.editPublic[data-post-id="${postId}"]`
          );
          textareaTitle.style.display = 'flex';
          textareaDescription.style.display = 'flex';
          saveEditButton.style.display = 'flex';
          descriptionEdit.style.display = 'flex';
          likeButton.style.display = 'none';

          saveEditButton.addEventListener('click', () => {
            editPost(postId, textareaTitle.value, textareaDescription.value)
              .then(() => {
                alert('Post editado con éxito');
                // Puedes recargar la lista de posts o actualizar la interfaz según sea necesario
              })
              .catch((error) => {
                console.error('Error al editar el post:', error);
              });
          });
        });
      });
    } else {
      viewPost.innerHTML = '<p> Aun no hay publicaciones </p>';
    }
  }

  // evento cerrar sesion
  logOutIcon.addEventListener('click', () => {
    // eslint-disable-next-line
    const alertlogOut = confirm('¿Está segur@ que desea salir de su cuenta?');
    if (alertlogOut === true) {
      logOut();
    } else {
      alert('Operación cancelada');
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Usuario autenticado, puedes acceder a la colección de 'post'
      console.log(
        'User authenticated:',
        auth.currentUser.uid,
        'email:',
        user.email
      );
      const userPostsCollection = collection(firestore, 'post');
      onSnapshot(userPostsCollection, (snapshot) => {
        const postSnap = [];
        snapshot.forEach((doc) => {
          postSnap.push(doc);
        });
        setupPost(postSnap);
      });
    } else {
      console.log('Usuario no autenticado');
      navigateTo('/login');
      backgroundLayer.style.opacity = 0.0;
      backgroundLayer.style.zIndex = '-1';
      backgroundLayer.style.top = '0';
      backgroundLayer.style.left = '0';
      backgroundLayer.style.width = '0%';
      backgroundLayer.style.height = '0%';
      homepage.style.boxShadow =
        '0 0 10px rgba(156, 158, 156, 0.346), 0 0 20px rgba(135, 136, 135, 0.5), 0 0 30px rgba(0, 255, 0, 0.203)';
      homepage.style.height = '90%';
      homepage.style.width = '90%';
      homepage.style.paddingTop = '0em';
    }
  });
  mainPage.append(headerPost, containerPubication, viewPost);
  headerPost.append(logoImage, logOutIcon);
  logOutIcon.append(iconLogOut);
  body1.appendChild(backgroundLayer);
  containerPubication.append(imagePublication, containerPost);
  containerPost.append(postTitle, post, buttonSave);
  return mainPage;
}

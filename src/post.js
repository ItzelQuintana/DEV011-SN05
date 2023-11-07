import { collection, getDocs } from 'firebase/firestore';
import {
  auth,
  firestore,
  saveTask,
  handleLike,
  deletePost,
  editPost,
  logOut,
  initializeAuth,
} from './firebase.js';

export function posts(navigateTo) {
  // const body1 = document.querySelector('body');
  const backgroundLayer = document.createElement('div');
  backgroundLayer.classList.add('background-layer');
  // homepage.style.boxShadow = '0px 0px 0px transparent';
  // homepage.style.height = '100%';
  // homepage.style.width = '100%';
  // homepage.style.paddingTop = '0em';
  // backgroundLayer.style.background = "url('/img/patron2.avif')";
  // backgroundLayer.style.opacity = 0.1;
  // backgroundLayer.style.zIndex = '-1';
  // backgroundLayer.style.top = '0';
  // backgroundLayer.style.left = '0';
  // backgroundLayer.style.width = '100%';
  // backgroundLayer.style.height = '100%';

  const mainPage = document.createElement('div');
  mainPage.setAttribute('class', 'homepage');
  mainPage.setAttribute('id', 'homepagePostes');
  const headerPost = document.createElement('div');
  headerPost.textContent = 'Mi Plantapp';
  headerPost.setAttribute('class', 'headerPost');
  const logoImage = document.createElement('img');
  logoImage.setAttribute('src', '/img/planta-arana.png');
  logoImage.setAttribute('class', 'logoImage');
  // Boton cerrar sesion
  const logOutIcon = document.createElement('button');
  logOutIcon.setAttribute('class', 'logOutButton');
  // icono cerrar sesion
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
  // Nuevo campo para cargar archivos (fotos)
  const imageInput = document.createElement('input');
  imageInput.setAttribute('type', 'file');
  imageInput.setAttribute('id', 'post-image');
  imageInput.setAttribute('accept', 'image/*');
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
    const imageFile = imageInput.files[0];
    // console.log(title, description);
    if (title === '' || description === '') {
      alert('Campos vacios');
    } else {
      saveTask(title, description, imageFile);
      // console.log(auth.currentUser.uid);
      containerPost.reset();
    }
  });

  function setupPost(data) {
    // console.log('Data inside setupPost:', data);
    if (data) {
      let html = '';
      data.forEach((doc) => {
        const postdata = doc.data();
        if (postdata.title && postdata.description) {
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
        }
        // else if (postdata.title && postdata.description && postdata.imageUrl) {
        // }
      });
      viewPost.innerHTML = html;
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
      // Evento Delete
      const deleteButton = document.querySelectorAll('.deleteButton');
      deleteButton.forEach((button) => {
        button.addEventListener('click', (e) => {
          // eslint-disable-next-line
           const alertDelete = confirm('¿Está segur@ que desea eliminar este post?');
          const postId = e.currentTarget.getAttribute('data-post-id');
          if (alertDelete === true) {
            deletePost(postId);
            alert('Post eliminado con éxito');
          } else {
            alert('Operación cancelada');
          }
        });
      });
      // Evento Editar
      const editButtons = document.querySelectorAll('.editButton');
      editButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          const postId = e.currentTarget.getAttribute('data-post-id');
          const textareaTitle = document.querySelector(
            `.editTextarea[data-post-id="${postId}"]`,
          );
          const textareaDescription = document.querySelector(
            `.editContentTextarea[data-post-id="${postId}"]`,
          );
          const saveEditButton = document.querySelector(
            `.saveEditButton[data-post-id="${postId}"]`,
          );
          const likeButton = document.querySelector(
            `.containerLikes[data-post-id="${postId}"]`,
          );
          const descriptionEdit = document.querySelector(
            `.editPublic[data-post-id="${postId}"]`,
          );
          textareaTitle.style.display = 'flex';
          textareaDescription.style.display = 'flex';
          saveEditButton.style.display = 'flex';
          descriptionEdit.style.display = 'flex';
          likeButton.style.display = 'none';

          saveEditButton.addEventListener('click', () => {
            editPost(postId, textareaTitle.value, textareaDescription.value)
              .then(() => {
                alert('Publicación editada con éxito');
              })
              .catch((error) => {
                console.error('Error al editar el post:', error);
              });
          });
        });
      });
    } else {
      // console.error('Data is not an array:', data);
      viewPost.innerHTML = '<p> Aun no hay publicaciones </p>';
    }
  }

  // evento cerrar sesion
  logOutIcon.addEventListener('click', () => {
    // eslint-disable-next-line
    const alertlogOut = confirm('¿Está segur@ que desea salir de su cuenta?');
    if (alertlogOut === true) {
      // mainPage.removeAttribute('class', 'homepage')
      logOut(navigateTo);
    } else {
      alert('Operación cancelada');
    }
  });

  initializeAuth(setupPost);

  mainPage.append(backgroundLayer, headerPost, containerPubication, viewPost);
  headerPost.append(logoImage, logOutIcon);
  logOutIcon.append(iconLogOut);
  containerPubication.append(imagePublication, containerPost);
  containerPost.append(postTitle, post, imageInput, buttonSave);
  return mainPage;
}

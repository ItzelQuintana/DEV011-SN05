import { getFirestore, collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
// import renderCreateAccount from './register.js';
// import { posts } from './post.js';

const firebaseConfig = {
  apiKey: 'AIzaSyA_nNPVRwXqmgLlxdYL4NmJwiItX9t2D5E',
  authDomain: 'social-network-c61c9.firebaseapp.com',
  projectId: 'social-network-c61c9',
  storageBucket: 'social-network-c61c9.appspot.com',
  messagingSenderId: '496904934051',
  appId: '1:496904934051:web:349b4f181faf09491c2516',
  measurementId: 'G-9MSK8FV9VP',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export {
  app, firestore, googleProvider, auth,
};

// Para crear o registrar usuarios
export function createUser(email, password) {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Registro exitoso', userCredential);
        const user = userCredential.user;
        resolve({ message: 'success', email: user.email });
      })
      .catch((error) => {
        console.error('Error al registrarse:', error.code, error.message, error.serverResponse);
        error.email = email;
        reject(error);
      });
  });
}

// Para iniciar sesion o ingresar
export function login(email, password) {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Inicio sesion exitoso', userCredential);
        const user = userCredential.user;
        resolve({ message: 'success', email: user.email });
      })
      .catch((error) => {
        console.error('Error al iniciar sesion:', error.code, error.message, error.serverResponse);
        error.email = email;
        reject(error);
      });
  });
}

// funcion save
export function saveTask(title, description) {
  addDoc(collection(firestore, 'post'), { title, description, likes: 0})
    .then((docRef) => {
      console.log('Documento guardado con ID:', docRef.id);
    })
    .catch((error) => {
      console.error('Error al guardar el documento:', error);
    });
  // console.log(title, description)
}

// funcion para registro con google
export function GoogleRegister() {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      console.log('Usuario autenticado con Google:', user);
    })
    .catch((error) => {
      console.error('Error al autenticar con Google:', error.message);
    });
}

//funcion para likes
export function handleLike(firestore, postId, callback) {
  const postRef = doc(firestore, 'post', postId);

  // Obtener el documento y actualizar el campo de likes
  getDoc(postRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const currentLikes = docSnapshot.data().likes;
        const updatedLikes = currentLikes + 1;

        // Actualizar el campo de likes en Firestore
        updateDoc(postRef, { likes: updatedLikes })
          .then(() => {
            console.log('Like registrado con éxito.');
            callback(); // Llama a la función de devolución de llamada para actualizar las publicaciones
          })
          .catch((error) => {
            console.error('Error al actualizar likes:', error);
          });
      }
    })
    .catch((error) => {
      console.error('Error al obtener documento:', error);
    });
}

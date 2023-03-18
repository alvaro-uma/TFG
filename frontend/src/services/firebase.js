import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDc80ZYHgjGfGQiP4ekQSNL4-X3J1OVH3A",
  authDomain: "tfg-portal.firebaseapp.com",
  projectId: "tfg-portal",
  storageBucket: "tfg-portal.appspot.com",
  messagingSenderId: "1002921619405",
  appId: "1:1002921619405:web:9a7494a9527afc95fcde84",
  measurementId: "G-TDLDQVJH6K",
};

export class FirebaseController {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }
  registerWithEmailAndPassword = async (data) => {
    try {
      const res = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
      const user = res.user;
      await addDoc(collection(this.db, "users"), {
        uid: user.uid,
        name: data.name,
        surname: data.name,
        email: user.email,
        role: data.role,
      });
      return "OK";
    } catch (err) {
      alert(err.code);
       return err.code;
    }
  };

  logInWithEmailAndPassword = async (email, password) => {
    setPersistence(this.auth, browserSessionPersistence)
      .then(async () => {
        try {
          await signInWithEmailAndPassword(this.auth, email, password);
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  logout = () => {
    signOut(this.auth);
    localStorage.clear();
  };

  //

  //  registerProfesor = async (email, password) => {
  //   try {
  //     // const res = await createUserWithEmailAndPassword(auth,email,password);
  //     // const user = res.user;
  //     await addDoc(collection(db, "users"), {
  //       uid: "pendiente",
  //       authProvider: "admin-reg",
  //       email: email,
  //       rol: "profesor",
  //     });
  //   } catch (err) {
  //     return err;
  //   }
  // };
}

// const googleProvider = new GoogleAuthProvider();
// const logInWithGoogle = async () => {
//   try {
//     const res = await signInWithPopup(auth, googleProvider);
//     const user = res.user;
//     const q = query(collection(db, "users"), where("uid", "==", user.uid));
//     const docs = await getDocs(q);
//     if (docs.docs.length == 0) {
//       await addDoc(collection(db, "users"), {
//         uid: user.uid,
//         name: user.displayName,
//         authProvider: "google",
//         email: user.email,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     alert(err.message);
//   }
// };

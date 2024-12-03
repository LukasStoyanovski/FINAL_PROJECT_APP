import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, {useState,  useEffect} from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'

const SignUpScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            if (user.emailVerified) {
              console.log("User email is verified:", user.email);
              // Navigate to the main app or a verified user screen
              navigation.replace("Login");
            } else {
              console.log("User email is not verified");
              alert("Please verify your email before proceeding.");
              // Optionally log the user out or navigate them to a verification screen
              
            }
          }
        });
      
        return unsubscribe;
      }, []);

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed up:", user.email);
      
            // Send email verification
            sendEmailVerification(user)
              .then(() => {
                alert("Verification email sent. Please check your inbox.");
              })
              .catch((error) => {
                console.error("Error sending email verification:", error.message);
                alert("Failed to send verification email. Try again.");
              });
          })
          .catch((error) => {
            console.error("Error signing up:", error.message);
            alert(error.message);
          });
      };

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior="padding"
    >
        <Text>Sign Up</Text>
      <View style={styles.inputContainer}>
        <TextInput
        placeholder='Email'
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
        />

        <TextInput
        placeholder='Password'
        value={password}
        onChangeText={text => setPassword(text)}
        style={styles.input}
        secureTextEntry
        />

      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
          >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
        <Text>Already have an Account?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.button}
          >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer:{
        width: '80%'
    },
    input:{
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer:{
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button:{
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        margin: 5,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline:{
        backgroundColor: 'white',
        marginTop: 5,
        marginBottom: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText:{
        color: '#0782F9',
        fontWight: '700',
        fontSize: 16,
    },
})
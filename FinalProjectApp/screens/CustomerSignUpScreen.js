import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming Firestore is initialized here

const CustomerSignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState(''); // Added repeat password state
    const [displayName, setDisplayName] = useState('');
    const [userType, setUserType] = useState('Customer'); // Default user type

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User created:", user);
                // Navigate to the main app or a verified user screen
                navigation.navigate("Verification");
            }
        });

        return unsubscribe;
    }, []);

    const handleSignUp = () => {
        if (password !== repeatPassword) {
            alert("Passwords do not match!");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Set the display name
                updateProfile(user, {
                    displayName: displayName
                })
                .then(() => {
                    console.log("Display name set:", displayName);
                })
                .catch((error) => {
                    console.error("Error setting display name:", error.message);
                    alert("Failed to set display name. Try again.");
                });
                console.log("User signed up:", user.displayName);
                
                // Send email verification
                sendEmailVerification(user)
                .then(() => {
                    console.log("Verification email sent. Please check your inbox.");
                })
                .catch((error) => {
                    console.error("Error sending email verification:", error.message);
                    alert("Failed to send verification email. Try again.");
                });

                // Create a document in the 'restaurants' collection
                const userRef = doc(db, 'users', user.uid);
                setDoc(userRef, {
                    userType: 'Customer',
                    email: user.email, // Optional: You can add other user data here
                    displayName: displayName,
                })
                .then(() => {
                    console.log("Restaurant document created in Firestore");
                })
                .catch((error) => {
                    console.error("Error creating document:", error.message);
                    alert("Failed to create restaurant document. Try again.");
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
                    placeholder='Name'
                    value={displayName}
                    onChangeText={text => setDisplayName(text)}
                    style={styles.input}
                />
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
                <TextInput
                    placeholder='Repeat Password' // Repeat password field
                    value={repeatPassword}
                    onChangeText={text => setRepeatPassword(text)}
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
    );
};

export default CustomerSignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        color: '#333',
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        margin: 5,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        marginBottom: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
});

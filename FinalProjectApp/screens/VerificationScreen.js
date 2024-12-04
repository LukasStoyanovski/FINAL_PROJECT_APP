import { KeyboardAvoidingView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';

const VerificationScreen = () => {
  const navigation = useNavigation();

  const handleButtonClick = async () => {
    // Reload the current user to check the latest state
    await auth.currentUser.reload();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        console.log('User email is verified:', user.email);
        unsubscribe(); // Clean up the listener
        navigation.replace('Home'); // Navigate to the home screen
      } else {
        console.log('User email is not verified');
        alert('Your email is not verified. Please verify your email.');
      }
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        <Text>You have received a verification email. Please verify your email.</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleButtonClick} // Trigger the check
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Check Verification</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
});

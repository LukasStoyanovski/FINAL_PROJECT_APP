import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming Firestore is initialized here
import RNPickerSelect from 'react-native-picker-select';

const ProfileScreen = () => {
  const navigation = useNavigation();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [userType, setUserType] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const userDoc = await getDoc(doc(db, 'restaurants', auth.currentUser?.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setPhoneNumber(userData.phoneNumber || '');
        setAddress(userData.address || '');
        setUserType(userData.userType || 'Customer'); // Assuming default is 'Customer'
      }
    };

    getUserData();
  }, []);

  const handleSave = async () => {
    const userRef = doc(db, 'restaurants', auth.currentUser?.uid);
    await setDoc(userRef, { phoneNumber, address, userType }, { merge: true });
    setIsEditing(false);
  };

  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        
        <View style={styles.boxContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.infoText}>{auth.currentUser?.displayName}</Text>
        </View>

        <View style={styles.boxContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.infoText}>{auth.currentUser?.email}</Text>
        </View>

        <View style={styles.boxContainer}>
        <Text style={styles.label}>Phone Number:</Text>
        {isEditing ? (
            <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            placeholder="Enter phone number"
            />
            ) : (
                <Text style={styles.infoText}>{phoneNumber}</Text>
                )}
        </View>

        <View style={styles.boxContainer}>
        <Text style={styles.label}>Address:</Text>
        {isEditing ? (
            <TextInput
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            placeholder="Enter address"
            />
            ) : (
                <Text style={styles.infoText}>{address}</Text>
                )}
        </View>

        <View style={styles.boxContainer}>
        <Text style={styles.label}>User Type: </Text>
        <Text style={styles.infoText}>{userType}</Text>
        
        </View>
        {userType == 'Restaurant' ? (
        <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Upload recipe</Text>
      </TouchableOpacity>) : ("")}

        <TouchableOpacity 
          onPress={isEditing ? handleSave : () => setIsEditing(true)} 
          style={styles.button}
        >
          <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit Profile'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignout} style={styles.signOutButton}>
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          onPress={() => {navigation.navigate("Home")}}
          style={styles.navButton}
        >
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {navigation.navigate("Profile")}} 
          style={styles.navButton}
        >
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Content above the bottom nav is pushed to the top
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingBottom: 60, // Adding space for the bottom nav bar to not overlap
    paddingTop: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingTop: 20,
    padding: 20,
  },
   boxContainer: {
    borderBottomWidth: 1,
    width: '100%',
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0782F9',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginTop: 5,
    backgroundColor: 'none',
    borderRadius: 8,
    borderWidth: 0,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    margin: 'auto',
  },
  signOutButton: {
    backgroundColor: '#FF0000',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
    margin: 'auto',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0, // Ensures it's always at the bottom
    left: 0,
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: '100%',
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0782F9',
  },
});

// Picker styles for RNPickerSelect
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: '100%',
    padding: 10,
    backgroundColor: 'none',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    color: '#555',
  },
  inputAndroid: {
    width: '100%',
    padding: 10,
    backgroundColor: 'none',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    color: '#555',
  },
});

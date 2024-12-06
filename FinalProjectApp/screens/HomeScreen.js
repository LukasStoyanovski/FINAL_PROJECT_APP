import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      {/* Content */}
      <View style={styles.content}>
        {/* Add your main content here */}
        <Text>Welcome, {auth.currentUser?.displayName}!</Text>
        {/* Add other content here */}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          onPress={() => {navigation.navigate("Home")}}
          style={styles.navButton}
        >
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {navigation.navigate("Search")}}
          style={styles.navButton}
        >
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

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,  // Take up all the available space
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60, // Optional: adds some padding to prevent overlap with bottom nav
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
    bottom: 0,  // Makes the nav bar stick to the bottom
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0782F9',
  },
});

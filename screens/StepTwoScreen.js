import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ROLES = [
  {
    id: 'student',
    title: 'Student',
    subtitle: 'Practice and develop yourself',
    image: require('../assets/role_student.png'),
    color: '#32CD32', // Green
  },
  {
    id: 'parent',
    title: 'Parent',
    subtitle: "Track and support your child's achievements",
    image: require('../assets/role_parent.png'),
    color: '#A855F7', // Purple
  },
  {
    id: 'teacher',
    title: 'Teacher',
    subtitle: 'Manage and develop your students',
    image: require('../assets/role_teacher.png'),
    color: '#3B82F6', // Blue
  },
];

export default function StepTwoScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleNext = () => {
    if (selectedRole) {
      // Proceed to AuthScreen
      navigation.navigate('AuthScreen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      
      {/* Header */}
      <View style={styles.headerCenter}>
        <Text style={styles.stepText}>STEP 2</Text>
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>CHOOSE YOUR ROLE</Text>

        <View style={styles.rolesContainer}>
          {ROLES.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleCard,
                  isSelected ? { borderColor: role.color } : null,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedRole(role.id)}
              >
                <Image source={role.image} style={styles.roleImage} resizeMode="contain" />
                
                <View style={styles.roleTextContainer}>
                  <Text style={styles.roleTitle}>{role.title}</Text>
                  <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
                </View>

                {isSelected && (
                  <View style={[styles.checkIcon, { backgroundColor: role.color }]}>
                    <MaterialCommunityIcons name="check" size={16} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer / Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.nextButton, !selectedRole && styles.nextButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleNext}
          disabled={!selectedRole}
        >
          <Text style={styles.nextButtonText}>NEXT</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050C',
  },
  headerCenter: {
    alignItems: 'center',
    marginVertical: 20,
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1A1A2E',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#A855F7',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 30,
  },
  rolesContainer: {
    gap: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A16',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#1A1A2E',
    padding: 12,
    overflow: 'hidden',
    position: 'relative',
    height: 120, // Ensure fixed height for uniformity
  },
  roleImage: {
    width: 90,
    height: 90,
    marginRight: 16,
    borderRadius: 10,
  },
  roleTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  roleTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  roleSubtitle: {
    color: '#888899',
    fontSize: 13,
    lineHeight: 18,
    paddingRight: 24, // Leave space for checkmark
  },
  checkIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  nextButton: {
    backgroundColor: '#FFC107', // Yellow
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
});

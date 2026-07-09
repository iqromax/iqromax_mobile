import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, TextInput, FlatList, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COUNTRIES } from '../data/countries';

const { width } = Dimensions.get('window');

const ALPHABET = ['ALL', ...Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)), '#'];

export default function StepThreeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [selectedCountry, setSelectedCountry] = useState('UZ');

  const filteredCountries = useMemo(() => {
    let result = COUNTRIES;
    
    if (searchQuery) {
      result = result.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (selectedLetter !== 'ALL') {
      if (selectedLetter === '#') {
        // Just for edge cases if numbers exist, though not really for standard countries
        result = result.filter(c => !/^[A-Za-z]/.test(c.name));
      } else {
        result = result.filter(c => c.name.startsWith(selectedLetter));
      }
    }
    return result;
  }, [searchQuery, selectedLetter]);

  const recommendedCountry = COUNTRIES.find(c => c.code === 'UZ');

  const renderCountryItem = ({ item }) => {
    const isSelected = selectedCountry === item.code;
    return (
      <TouchableOpacity 
        style={[styles.countryItem, isSelected && styles.countryItemSelected]}
        onPress={() => setSelectedCountry(item.code)}
        activeOpacity={0.7}
      >
        <View style={styles.countryInfo}>
          <Text style={styles.flag}>{item.flag}</Text>
          <View style={styles.countryTextContainer}>
            <Text style={styles.countryName}>{item.name}</Text>
            <Text style={styles.capitalName}>{item.capital}</Text>
          </View>
        </View>
        
        {isSelected ? (
          <View style={styles.radioSelected}>
            <MaterialCommunityIcons name="check" size={16} color="#FFF" />
          </View>
        ) : (
          <View style={styles.radioUnselected} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.stepText}>STEP 3</Text>
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>
        </View>
      </View>

      <FlatList
        data={filteredCountries}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Image 
              source={require('../assets/hero_card.png')} 
              style={styles.heroCardImage} 
              contentFit="fill" 
              transition={200}
            />

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a country..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setSelectedLetter('ALL'); // Reset alphabet filter when searching
                }}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.alphabetScroll}
              contentContainerStyle={styles.alphabetContent}
            >
              {ALPHABET.map(letter => {
                const isActive = selectedLetter === letter && !searchQuery;
                return (
                  <TouchableOpacity
                    key={letter}
                    style={[styles.letterButton, isActive && styles.letterButtonActive]}
                    onPress={() => {
                      setSelectedLetter(letter);
                      setSearchQuery(''); // Reset search when clicking alphabet
                    }}
                  >
                    <Text style={[styles.letterText, isActive && styles.letterTextActive]}>
                      {letter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {!searchQuery && selectedLetter === 'ALL' && recommendedCountry && (
              <>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="star-outline" size={16} color="#A855F7" />
                  <Text style={styles.sectionTitle}>RECOMMENDED FOR YOU</Text>
                </View>
                {renderCountryItem({ item: recommendedCountry })}
                
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="web" size={16} color="#A855F7" />
                  <Text style={styles.sectionTitle}>ALL COUNTRIES</Text>
                </View>
              </>
            )}
          </>
        }
        renderItem={renderCountryItem}
        initialNumToRender={15}
        maxToRenderPerBatch={20}
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.button, !selectedCountry && styles.buttonDisabled]} 
          activeOpacity={0.8}
          disabled={!selectedCountry}
          onPress={() => {
            requestAnimationFrame(() => {
              navigation.navigate('StepFour');
            });
          }}
        >
          <Text style={styles.buttonText}>CONTINUE</Text>
          <MaterialCommunityIcons name="chevron-right" size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050C',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'android' ? 5 : 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    zIndex: 10,
    padding: 5,
  },
  headerCenter: {
    alignItems: 'center',
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333344',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#A855F7',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 0 : 10,
  },
  heroCardImage: {
    width: '100%',
    height: 190,
    marginTop: Platform.OS === 'android' ? 0 : 10,
    marginBottom: 20,
    borderRadius: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12121D',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  alphabetScroll: {
    marginBottom: 24,
  },
  alphabetContent: {
    paddingRight: 20,
    gap: 8,
  },
  letterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  letterButtonActive: {
    backgroundColor: '#A855F7',
    borderColor: '#A855F7',
  },
  letterText: {
    color: '#888899',
    fontSize: 14,
    fontWeight: '600',
  },
  letterTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    color: '#A855F7',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A0A16',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  countryItemSelected: {
    borderColor: '#A855F7',
    backgroundColor: '#120A20',
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 28,
    marginRight: 16,
  },
  countryTextContainer: {
    flex: 1,
  },
  countryName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  capitalName: {
    color: '#888899',
    fontSize: 13,
  },
  radioUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333344',
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#05050C',
    borderTopWidth: 1,
    borderTopColor: '#1A1A2E',
  },
  button: {
    backgroundColor: '#FACC15',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  buttonDisabled: {
    backgroundColor: '#555540',
    opacity: 0.7,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 4,
  },
});

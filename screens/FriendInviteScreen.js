import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FriendInviteScreen = ({ navigation, route }) => {
  const [friendId, setFriendId] = useState('');
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const inviteLink = 'iqromax.app/battle/invite/IQX567890';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Do'st bilan battle</Text>
          <TouchableOpacity style={styles.helpButton}>
            <MaterialCommunityIcons name="help" size={20} color="#A855F7" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stepper */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepActive]}>
                <Text style={styles.stepTextActive}>1</Text>
              </View>
              <Text style={styles.stepLabelActive}>ID orqali taklif</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepInactive]}>
                <Text style={styles.stepTextInactive}>2</Text>
              </View>
              <Text style={styles.stepLabelInactive}>Do'st qabul qildi</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepInactive]}>
                <Text style={styles.stepTextInactive}>3</Text>
              </View>
              <Text style={styles.stepLabelInactive}>Battle boshlash</Text>
            </View>
          </View>

          {/* Central Image/Icon Area */}
          <View style={styles.heroContainer}>
            {/* Decorative background glows can be simulated with nested views */}
            <View style={styles.glowCircle} />
            <MaterialCommunityIcons name="account-search" size={90} color="#A855F7" style={styles.heroIcon} />
            <MaterialCommunityIcons name="lightning-bolt" size={40} color="rgba(168, 85, 247, 0.3)" style={styles.lightningLeft} />
            <MaterialCommunityIcons name="lightning-bolt" size={40} color="rgba(168, 85, 247, 0.3)" style={styles.lightningRight} />
          </View>

          <View style={styles.titlesContainer}>
            <Text style={styles.mainTitle}>Do'stingizni ID orqali taklif qiling</Text>
            <Text style={styles.subTitle}>Do'stingizning IQROMAX ID sini kiriting{"\n"}va battle taklifini yuboring!</Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Do'stingizning ID sini kiriting</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <View style={styles.inputIconWrapper}>
                  <MaterialCommunityIcons name="account" size={20} color="#FFF" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="ID ni kiriting (masalan: IQX12345)"
                  placeholderTextColor="#6B7280"
                  value={friendId}
                  onChangeText={setFriendId}
                />
                {friendId.length > 0 && (
                  <TouchableOpacity onPress={() => setFriendId('')}>
                    <MaterialCommunityIcons name="close-circle" size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity style={styles.sendLinkBtn}>
                <MaterialCommunityIcons name="link-variant" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Link Section */}
          <View style={styles.linkCard}>
            <View style={styles.linkIconBox}>
              <MaterialCommunityIcons name="link-variant" size={24} color="#A855F7" />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Sizning taklif havolangiz</Text>
              <Text style={styles.linkText}>{inviteLink}</Text>
              <Text style={styles.linkDesc}>Ushbu havolani do'stingiz bilan ulashing</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn}>
              <MaterialCommunityIcons name="content-copy" size={20} color="#A855F7" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>YOKI</Text>
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.dividerSubtext}>Pastdagi maydonda do'stingizni qidirib toping</Text>

          {/* Search Empty State */}
          <View style={styles.searchStateCard}>
            <MaterialCommunityIcons name="magnify" size={60} color="rgba(255, 255, 255, 0.2)" />
            <Text style={styles.searchStateTitle}>Do'stingizni qidiring</Text>
            <Text style={styles.searchStateSub}>ID kiriting yoki havolani ulashing,{"\n"}u yerda paydo bo'ladi</Text>
          </View>

          {/* Bottom Info Card */}
          <TouchableOpacity 
            style={styles.infoCard}
            onPress={() => setIsInfoExpanded(!isInfoExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.infoIconBox}>
              <MaterialCommunityIcons name="lightbulb-on" size={24} color="#A855F7" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>ID ni qayerdan topish mumkin?</Text>
              {isInfoExpanded && (
                <Text style={styles.infoDesc}>ID ni profilingiz sahifasidan topishingiz mumkin.</Text>
              )}
            </View>
            <MaterialCommunityIcons 
              name={isInfoExpanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#A855F7" 
            />
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#05050C',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    fontWeight: 'bold',
  },
  helpButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  stepActive: {
    backgroundColor: '#A855F7',
  },
  stepInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  stepTextActive: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepTextInactive: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepLabelActive: {
    color: '#A855F7',
    fontSize: 12,
    fontWeight: '600',
  },
  stepLabelInactive: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '600',
  },
  stepLine: {
    height: 1,
    flex: 1,
    backgroundColor: '#374151',
    marginHorizontal: 8,
  },
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    marginBottom: 20,
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  heroIcon: {
    zIndex: 2,
  },
  lightningLeft: {
    position: 'absolute',
    left: '20%',
    top: '30%',
    transform: [{ rotate: '-15deg' }],
  },
  lightningRight: {
    position: 'absolute',
    right: '20%',
    top: '30%',
    transform: [{ rotate: '15deg' }],
  },
  titlesContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 56,
    marginRight: 12,
  },
  inputIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  sendLinkBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },
  linkIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  linkText: {
    color: '#A855F7',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  linkDesc: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  copyBtn: {
    padding: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
    borderStyle: 'dashed',
  },
  dividerText: {
    color: '#A855F7',
    paddingHorizontal: 16,
    fontWeight: 'bold',
  },
  dividerSubtext: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 20,
  },
  searchStateCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchStateTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  searchStateSub: {
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoDesc: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 16,
  },
});

export default FriendInviteScreen;

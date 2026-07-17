import re

file_path = '/home/iam_masharipov/Desktop/iqromax_mobile/screens/StudentDashboardScreen.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

ramka_func = """
  const framesData = [
    { id: 1, name: 'Tech Frame', rarity: 'EPIC', color: '#A855F7', state: 'AKTIV', image: require('../assets/gold_frame.png') },
    { id: 2, name: 'Neon Frame', rarity: 'EPIC', color: '#A855F7', state: 'KIYISH', image: require('../assets/gold_frame.png') },
    { id: 3, name: 'Cyber Frame', rarity: 'RARE', color: '#3B82F6', state: 'KIYISH', image: require('../assets/gold_frame.png') },
    { id: 4, name: 'Warrior Frame', rarity: 'RARE', color: '#3B82F6', state: 'KIYISH', image: require('../assets/gold_frame.png') },
    { id: 5, name: 'Elite Frame', rarity: 'LEGENDARY', color: '#EAB308', state: 'BUY', price: '10 000', image: require('../assets/gold_frame.png') },
    { id: 6, name: 'Golden Frame', rarity: 'LEGENDARY', color: '#EAB308', state: 'BUY', price: '8 000', image: require('../assets/gold_frame.png') },
    { id: 7, name: 'Flame Frame', rarity: 'EPIC', color: '#A855F7', state: 'KIYISH', image: require('../assets/gold_frame.png') },
    { id: 8, name: 'Ice Frame', rarity: 'RARE', color: '#3B82F6', state: 'KIYISH', image: require('../assets/gold_frame.png') },
    { id: 9, name: 'Shadow Frame', rarity: 'EPIC', color: '#A855F7', state: 'KIYISH', image: require('../assets/gold_frame.png') },
    { id: 10, name: 'Hero Frame', rarity: 'LEGENDARY', color: '#EAB308', state: 'BUY', price: '15 000', image: require('../assets/gold_frame.png') },
  ];

  const renderFramesGrid = () => {
    return framesData.map((item, i) => {
      return (
        <View key={item.id} style={{ width: '19%', aspectRatio: 0.8, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 10, borderWidth: 1, borderColor: item.state === 'AKTIV' ? '#EAB308' : 'rgba(255,255,255,0.08)', marginBottom: 12, padding: 8, alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {item.state === 'AKTIV' && (
             <View style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: '#EAB308', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
               <MaterialCommunityIcons name="check" size={10} color="#000" />
             </View>
          )}
          <Image source={item.image} style={{ width: '80%', height: '50%', resizeMode: 'contain', marginTop: 5 }} />
          <View style={{ alignItems: 'center', width: '100%', marginTop: 4 }}>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 8, textAlign: 'center', marginBottom: 2 }} numberOfLines={1}>{item.name}</Text>
            <Text style={{ color: item.color, fontFamily: 'Inter_700Bold', fontSize: 7, marginBottom: 6 }}>{item.rarity}</Text>
            
            {item.state === 'AKTIV' && (
              <View style={{ backgroundColor: 'rgba(234,179,8,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                 <MaterialCommunityIcons name="check-circle" size={10} color="#EAB308" style={{ marginRight: 4 }} />
                 <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 8 }}>AKTIV</Text>
              </View>
            )}
            {item.state === 'KIYISH' && (
              <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, width: '100%', alignItems: 'center' }}>
                 <Text style={{ color: '#60A5FA', fontFamily: 'Inter_700Bold', fontSize: 8 }}>KIYISH</Text>
              </TouchableOpacity>
            )}
            {item.state === 'BUY' && (
              <TouchableOpacity style={{ backgroundColor: 'rgba(234,179,8,0.15)', paddingHorizontal: 4, paddingVertical: 4, borderRadius: 4, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                 <Image source={require('../assets/s_coin.png')} style={{ width: 10, height: 10, marginRight: 3 }} />
                 <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 8 }}>{item.price}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )
    });
  };

  const renderRamkaScreen = () => {
    return (
      <View style={{ flex: 1, backgroundColor: '#05050C', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40, paddingBottom: 15 }}>
          <TouchableOpacity 
            style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => setInventorySubTab('personaj')}
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 20, letterSpacing: 1 }}>RAMKA</Text>
            <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 2 }}>Profilingizni bezang</Text>
          </View>
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons name="fullscreen" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginTop: 10, height: 260 }}>
          <View style={{ flex: 1, justifyContent: 'space-between', paddingRight: 10 }}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(168,85,247,0.05)', borderRadius: 12, borderWidth: 1, borderColor: '#A855F7', padding: 10, marginBottom: 8, shadowColor: '#A855F7', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5, justifyContent: 'center' }}>
              <MaterialCommunityIcons name="face-man-profile" size={28} color="#A855F7" style={{ marginBottom: 5 }} />
              <Text style={{ color: '#A855F7', fontFamily: 'Inter_700Bold', fontSize: 12, marginBottom: 2 }}>KO'RINISH</Text>
              <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_500Medium', fontSize: 8 }}>Profil ko'rinishini sozlang</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" style={{ position: 'absolute', right: 10, top: '50%', transform: [{ translateY: -10 }] }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(234,179,8,0.05)', borderRadius: 12, borderWidth: 1, borderColor: '#EAB308', padding: 10, marginBottom: 8, shadowColor: '#EAB308', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5, justifyContent: 'center' }}>
              <MaterialCommunityIcons name="trophy" size={28} color="#EAB308" style={{ marginBottom: 5 }} />
              <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 12, marginBottom: 2 }}>YUTUQLAR</Text>
              <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_500Medium', fontSize: 8 }}>Yutuqlaringizni ko'rsating</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#EAB308" style={{ position: 'absolute', right: 10, top: '50%', transform: [{ translateY: -10 }] }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(6,182,212,0.05)', borderRadius: 12, borderWidth: 1, borderColor: '#06B6D4', padding: 10, shadowColor: '#06B6D4', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5, justifyContent: 'center' }}>
              <MaterialCommunityIcons name="hexagon-slice-6" size={28} color="#06B6D4" style={{ marginBottom: 5 }} />
              <Text style={{ color: '#06B6D4', fontFamily: 'Inter_700Bold', fontSize: 12, marginBottom: 2 }}>MAXSUS</Text>
              <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_500Medium', fontSize: 8 }}>Maxsus effektlar va aksessuarlar</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#06B6D4" style={{ position: 'absolute', right: 10, top: '50%', transform: [{ translateY: -10 }] }} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 160, height: 160, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
               <Image source={require('../assets/avatar_maks.png')} style={{ width: 110, height: 110, borderRadius: 55 }} />
               <Image source={require('../assets/gold_frame.png')} style={{ position: 'absolute', width: 160, height: 160, resizeMode: 'contain' }} />
               <View style={{ position: 'absolute', bottom: -20, width: 180, height: 40, borderRadius: 90, borderWidth: 1, borderColor: '#3B82F6', transform: [{ scaleY: 0.3 }], shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 }} />
               <View style={{ position: 'absolute', bottom: -20, width: 140, height: 30, borderRadius: 70, borderWidth: 2, borderColor: '#60A5FA', transform: [{ scaleY: 0.3 }], shadowColor: '#60A5FA', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 15 }} />
            </View>
            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(168,85,247,0.2)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 4, marginBottom: 5 }}>
                <Text style={{ color: '#A855F7', fontFamily: 'Inter_700Bold', fontSize: 9 }}>EPIC</Text>
              </View>
              <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 16, marginBottom: 5 }}>Tech Frame</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="check-circle" size={12} color="#EAB308" style={{ marginRight: 4 }} />
                <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 10 }}>AKTIV</Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'space-between' }}>
             <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 10 }}>
               <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 12, marginBottom: 4 }}>Tech Frame</Text>
               <View style={{ backgroundColor: 'rgba(168,85,247,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 8 }}>
                 <Text style={{ color: '#A855F7', fontFamily: 'Inter_700Bold', fontSize: 8 }}>EPIC</Text>
               </View>
               <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_500Medium', fontSize: 9, lineHeight: 14 }}>Zamonaviy texnologik uslubdagi ramka.</Text>
             </View>

             <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', flex: 1 }}>
               <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_700Bold', fontSize: 9, marginBottom: 2 }}>OCHILGAN:</Text>
               <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 18, marginBottom: 6 }}>12 / 36</Text>
               <View style={{ width: '100%', height: 4, backgroundColor: '#1F2937', borderRadius: 2, marginBottom: 12 }}>
                 <View style={{ width: '33%', height: 4, backgroundColor: '#EAB308', borderRadius: 2 }} />
               </View>

               <View style={{ gap: 6 }}>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 }} />
                     <Text style={{ color: '#D1D5DB', fontFamily: 'Inter_600SemiBold', fontSize: 9 }}>ODDIY</Text>
                   </View>
                   <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>4</Text>
                 </View>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#3B82F6', marginRight: 6 }} />
                     <Text style={{ color: '#D1D5DB', fontFamily: 'Inter_600SemiBold', fontSize: 9 }}>RARE</Text>
                   </View>
                   <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>5</Text>
                 </View>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#A855F7', marginRight: 6 }} />
                     <Text style={{ color: '#D1D5DB', fontFamily: 'Inter_600SemiBold', fontSize: 9 }}>EPIC</Text>
                   </View>
                   <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>2</Text>
                 </View>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#EAB308', marginRight: 6 }} />
                     <Text style={{ color: '#D1D5DB', fontFamily: 'Inter_600SemiBold', fontSize: 9 }}>LEGENDARY</Text>
                   </View>
                   <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>1</Text>
                 </View>
               </View>
             </View>

             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginTop: 10 }}>
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <MaterialCommunityIcons name="star-circle" size={14} color="#9CA3AF" style={{ marginRight: 6 }} />
                 <Text style={{ color: '#D1D5DB', fontFamily: 'Inter_600SemiBold', fontSize: 8 }}>RAMKALAR KO'RINISHI</Text>
               </View>
               <View style={{ width: 28, height: 16, borderRadius: 8, backgroundColor: '#0284C7', justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 2 }}>
                 <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF' }} />
               </View>
             </View>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 20 }} />

        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 20 }}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                <MaterialCommunityIcons name="view-grid" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>BARCHASI</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 }} />
                <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>ODDIY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                <MaterialCommunityIcons name="diamond" size={10} color="#3B82F6" style={{ marginRight: 6 }} />
                <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>RARE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                <MaterialCommunityIcons name="diamond" size={10} color="#A855F7" style={{ marginRight: 6 }} />
                <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>EPIC</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                <MaterialCommunityIcons name="crown" size={12} color="#EAB308" style={{ marginRight: 6 }} />
                <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>LEGENDARY</Text>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
              <MaterialCommunityIcons name="filter-variant" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
               {renderFramesGrid()}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
"""

# Find return statement
match = re.search(r'(\n\s*return \(\n\s*<SafeAreaView)', content)
if match:
    content = content[:match.start()] + "\n" + ramka_func + match.group(1) + content[match.end():]
    
# Now find where the INVENTORY TAB CONTENT ends and insert the call
inventory_end_pattern = r'(</ScrollView>\n\s*)(</View>\n\s*<!-- INVENTORY TAB END -->|\s*</View>\s*\{\/\* RANKING TAB CONTENT \*\/})'

# Actually, I can just inject it right before the Inventory Tab View closing tag.
# Let's search for {/* RANKING TAB CONTENT */} to find the end of the inventory tab
match_inventory_end = re.search(r'(\s*</View>\s*\{\/\* RANKING TAB CONTENT \*\/})', content)
if match_inventory_end:
    injection = "\n          {inventorySubTab === 'ramka' && renderRamkaScreen()}\n"
    content = content[:match_inventory_end.start()] + injection + match_inventory_end.group(1) + content[match_inventory_end.end():]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected successfully.")


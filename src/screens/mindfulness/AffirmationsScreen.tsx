import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

interface AffirmationsScreenProps {
  navigation: any;
}

interface Affirmation {
  id: string;
  text: string;
  category: string;
  favorite?: boolean;
}

const { width } = Dimensions.get('window');

const affirmations: Affirmation[] = [
  { id: '1', text: 'I am capable of handling whatever comes my way', category: 'Confidence' },
  { id: '2', text: 'I choose to be calm and peaceful', category: 'Peace' },
  { id: '3', text: 'I am worthy of love and respect', category: 'Self-Love' },
  { id: '4', text: 'I trust in my journey and my growth', category: 'Growth' },
  { id: '5', text: 'My potential is limitless, and I can achieve my dreams', category: 'Confidence' },
  { id: '6', text: 'I am grateful for everything I have in my life', category: 'Gratitude' },
  { id: '7', text: 'I am in charge of how I feel, and today I choose happiness', category: 'Happiness' },
  { id: '8', text: 'I have the power to create positive change', category: 'Growth' },
  { id: '9', text: 'I am becoming better every day', category: 'Growth' },
  { id: '10', text: 'My body is healthy; my mind is brilliant; my soul is tranquil', category: 'Health' }
];

export const AffirmationsScreen: React.FC<AffirmationsScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredAffirmations, setFilteredAffirmations] = useState<Affirmation[]>(affirmations);
  const [showFavorites, setShowFavorites] = useState(false);
  const [localAffirmations, setLocalAffirmations] = useState<Affirmation[]>(affirmations);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const translateXAnim = React.useRef(new Animated.Value(0)).current;
  
  // Get unique categories from affirmations
  const categories = ['All', ...Array.from(new Set(affirmations.map(a => a.category)))];
  
  // Filter affirmations when category or favorites filter changes
  useEffect(() => {
    let filtered = localAffirmations;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }
    
    if (showFavorites) {
      filtered = filtered.filter(a => a.favorite);
    }
    
    setFilteredAffirmations(filtered.length > 0 ? filtered : localAffirmations);
    setCurrentIndex(0); // Reset to first affirmation when filters change
  }, [selectedCategory, showFavorites, localAffirmations]);
  
  const handleNext = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateXAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Update index
      setCurrentIndex((prev) => (prev + 1) % filteredAffirmations.length);
      
      // Reset animation values
      translateXAnim.setValue(50);
      
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };
  
  const handlePrev = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateXAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Update index
      setCurrentIndex((prev) => 
        prev === 0 ? filteredAffirmations.length - 1 : prev - 1
      );
      
      // Reset animation values
      translateXAnim.setValue(-50);
      
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };
  
  const handleToggleFavorite = (id: string) => {
    setLocalAffirmations(prev => 
      prev.map(a => 
        a.id === id ? { ...a, favorite: !a.favorite } : a
      )
    );
  };
  
  const currentAffirmation = filteredAffirmations[currentIndex];
  
  // Get background color based on category
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'Confidence': '#EBF8FF',
      'Peace': '#E6FFFA',
      'Self-Love': '#FED7E2',
      'Growth': '#E9D8FD',
      'Gratitude': '#FEFCBF',
      'Happiness': '#FEEBC8',
      'Health': '#C6F6D5'
    };
    
    return colorMap[category] || '#F7FAFC';
  };
  
  // Get text color based on category
  const getCategoryTextColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'Confidence': '#2B6CB0',
      'Peace': '#2C7A7B',
      'Self-Love': '#B83280',
      'Growth': '#6B46C1',
      'Gratitude': '#B7791F',
      'Happiness': '#C05621',
      'Health': '#2F855A'
    };
    
    return colorMap[category] || '#4A5568';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F0F4F8', '#DEF5FA']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Daily Affirmations</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {/* Category filter */}
          <View style={styles.filterContainer}>
            <ScrollableCategories 
              categories={categories} 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            
            <TouchableOpacity
              style={styles.favoritesToggle}
              onPress={() => setShowFavorites(!showFavorites)}
            >
              <Text style={[
                styles.favoritesText,
                showFavorites && styles.favoritesTextActive
              ]}>
                {showFavorites ? '★ Favorites' : '☆ Show Favorites'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Affirmation card */}
          <View style={styles.affirmationContainer}>
            {filteredAffirmations.length > 0 ? (
              <Animated.View
                style={[
                  styles.affirmationCard,
                  {
                    backgroundColor: getCategoryColor(currentAffirmation.category),
                    opacity: fadeAnim,
                    transform: [{ translateX: translateXAnim }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => handleToggleFavorite(currentAffirmation.id)}
                >
                  <Text style={styles.favoriteIcon}>
                    {currentAffirmation.favorite ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
                
                <View style={styles.categoryTag}>
                  <Text style={[
                    styles.categoryText,
                    { color: getCategoryTextColor(currentAffirmation.category) }
                  ]}>
                    {currentAffirmation.category}
                  </Text>
                </View>
                
                <Text style={styles.affirmationText}>
                  {currentAffirmation.text}
                </Text>
              </Animated.View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No affirmations found</Text>
                <Text style={styles.emptySubtext}>Try changing your filters</Text>
              </View>
            )}
          </View>

          {/* Navigation */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handlePrev}
              disabled={filteredAffirmations.length <= 1}
            >
              <Text style={styles.navButtonText}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.dotsContainer}>
              {filteredAffirmations.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index && styles.activeDot
                  ]}
                />
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNext}
              disabled={filteredAffirmations.length <= 1}
            >
              <Text style={styles.navButtonText}>→</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Next Affirmation"
            onPress={handleNext}
            size="large"
            style={styles.nextButton}
            disabled={filteredAffirmations.length <= 1}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Scrollable categories component
const ScrollableCategories = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: { 
  categories: string[], 
  selectedCategory: string, 
  onSelectCategory: (category: string) => void 
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonActive
          ]}
          onPress={() => onSelectCategory(category)}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category && styles.categoryButtonTextActive
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    fontSize: 16,
    color: '#1E3A5F',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  filterContainer: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingVertical: 4,
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#1E3A5F',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  favoritesToggle: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  favoritesText: {
    fontSize: 14,
    color: '#4A5568',
  },
  favoritesTextActive: {
    color: '#F6AD55',
    fontWeight: '600',
  },
  affirmationContainer: {
    height: 300,
    marginBottom: 24,
    justifyContent: 'center',
  },
  affirmationCard: {
    borderRadius: 16,
    padding: 24,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#F6AD55',
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  affirmationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#1E3A5F',
  },
  nextButton: {
    alignSelf: 'center',
    width: '80%',
  },
});
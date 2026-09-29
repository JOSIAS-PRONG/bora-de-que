import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HomeScreen } from '../screens/HomeScreen';
import { SuggestionsScreen } from '../screens/SuggestionsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { colors } from '../theme';
import type { RootParamList, TabParamList } from './types';
import type { IconName } from '../components/ui';
const Tabs = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootParamList>();
const icons: Record<keyof TabParamList, [IconName, IconName]> = { Inicio: ['home-outline', 'home'], Sugestoes: ['compass-outline', 'compass'], Favoritos: ['heart-outline', 'heart'], Historico: ['time-outline', 'time'] };
function TabNavigator() {
  return <Tabs.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.border }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }, tabBarIcon: ({ focused, color, size }) => <Ionicons name={icons[route.name][focused ? 1 : 0]} size={size} color={color} /> })}>
    <Tabs.Screen name="Inicio" component={HomeScreen} options={{ title: 'Início' }} />
    <Tabs.Screen name="Sugestoes" component={SuggestionsScreen} options={{ title: 'Sugestões' }} />
    <Tabs.Screen name="Favoritos" component={FavoritesScreen} />
    <Tabs.Screen name="Historico" component={HistoryScreen} options={{ title: 'Histórico' }} />
  </Tabs.Navigator>;
}
export function AppNavigator() {
  return <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: colors.primary, background: colors.background, card: colors.paper, text: colors.text, border: colors.border } }}><Stack.Navigator screenOptions={{ headerTintColor: colors.primary, headerShadowVisible: false, headerStyle: { backgroundColor: colors.background }, headerBackTitle: 'Voltar', contentStyle: { backgroundColor: colors.background } }}>
    <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Detalhes" component={DetailsScreen} options={{ title: 'Sua próxima ideia' }} />
  </Stack.Navigator></NavigationContainer>;
}

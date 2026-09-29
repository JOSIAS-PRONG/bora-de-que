import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { useApp } from './src/hooks/useApp';
import { AppNavigator } from './src/navigation/AppNavigator';
import { IconButton } from './src/components/ui';
import { colors, styles } from './src/theme';
function Content() {
  const { ready, error, dismissError } = useApp();
  if (!ready) return <View style={[styles.page, { alignItems: 'center', justifyContent: 'center', gap: 16 }]}><ActivityIndicator color={colors.primary} /><Text style={styles.small}>Preparando suas boas ideias…</Text></View>;
  return <View style={{ flex: 1 }}>{error && <SafeAreaView edges={['top']} style={{ backgroundColor: colors.peach }}><View style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}><Text accessibilityRole="alert" style={[styles.small, { flex: 1, color: colors.text }]}>{error}</Text><IconButton icon="close" label="Fechar aviso" onPress={dismissError} /></View></SafeAreaView>}<AppNavigator /></View>;
}
export default function App() {
  return <SafeAreaProvider><AppProvider><StatusBar style="dark" /><Content /></AppProvider></SafeAreaProvider>;
}

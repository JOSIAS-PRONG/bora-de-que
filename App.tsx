import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useApp } from './src/hooks/useApp';
import { PrimaryButton } from './src/components/ui';
import { colors, styles } from './src/theme';

function Content() {
  const { ready, loading, error, retry, dismissError } = useApp();
  if (!ready) return <SafeAreaView style={[styles.page, { justifyContent: 'center', padding: 24, gap: 16 }]}>
    {loading ? <><ActivityIndicator color={colors.primary} /><Text style={styles.body}>Carregando seus dados…</Text></> : <><Text accessibilityRole="alert" style={styles.body}>{error}</Text><PrimaryButton title="Tentar novamente" onPress={retry} /></>}
  </SafeAreaView>;
  return <View style={{ flex: 1 }}>
    {error && <SafeAreaView edges={['top']} style={{ backgroundColor: colors.peach, padding: 12, gap: 8 }}><Text accessibilityRole="alert" style={styles.body}>{error}</Text><PrimaryButton title="Fechar aviso" secondary onPress={dismissError} /></SafeAreaView>}
    <AppNavigator />
  </View>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Content />
      </AppProvider>
    </SafeAreaProvider>
  );
}

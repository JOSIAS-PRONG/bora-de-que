import React, { useState } from 'react';
import { FlatList, Text, TextInput, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityCard } from '../components/ActivityCard';
import { EmptyState, FilterChip, PageHeading, PrimaryButton, ScreenContainer } from '../components/ui';
import { activities } from '../data/activities';
import { useApp } from '../hooks/useApp';
import { categories, type Category } from '../types';
import { filterActivities, filterSummary, searchActivities } from '../utils/activities';
import { colors, styles as s } from '../theme';
import type { TabProps } from '../navigation/types';
export function SuggestionsScreen({ navigation }: TabProps<'Sugestoes'>) {
  const { filters, draw } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | undefined>();
  const results = searchActivities(filterActivities(activities, filters), query, category);
  function choose() { const chosen = draw(results); if (chosen) navigation.navigate('Detalhes', { activityId: chosen.id }); }
  return <ScreenContainer><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <FlatList data={results} keyExtractor={a => a.id} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
      ListHeaderComponent={<View style={s.section}>
        <PageHeading eyebrow="SEU PRÓXIMO BOM MOMENTO" title="Ideias para agora" subtitle="Encontre algo que combine com você hoje." />
        <View style={[s.panel, { backgroundColor: colors.lavender, borderWidth: 0 }]}><Text style={[s.small, { color: colors.primaryDark }]}>{filterSummary(filters)}</Text><PrimaryButton title="Alterar filtros" secondary icon="options-outline" onPress={() => navigation.navigate('Inicio')} /></View>
        <View style={local.search}><Ionicons name="search-outline" size={22} color={colors.muted} /><TextInput accessibilityLabel="Buscar atividade pelo título" placeholder="Que ideia você procura?" placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} style={local.input} returnKeyType="search" autoCorrect={false} /></View>
        <View style={s.wrap}><FilterChip label="Todas" selected={!category} onPress={() => setCategory(undefined)} />{categories.map(c => <FilterChip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />)}</View>
        <PrimaryButton title="Sortear uma ideia" secondary icon="shuffle" disabled={!results.length} onPress={choose} />
        <Text accessibilityLiveRegion="polite" style={[s.small, { marginVertical: 8 }]}>{results.length} {results.length === 1 ? 'ideia encontrada' : 'ideias encontradas'} · tempo e custo estimados</Text>
      </View>}
      renderItem={({ item }) => <ActivityCard activity={item} onOpen={() => navigation.navigate('Detalhes', { activityId: item.id })} />}
      ListEmptyComponent={<View style={s.section}><EmptyState title="Vamos tentar de outro jeito?" message="Nenhuma ideia combina com essa seleção. Ajuste suas preferências ou limpe a busca e a categoria." action="Limpar busca e categoria" onAction={() => { setQuery(''); setCategory(undefined); }} /><PrimaryButton title="Alterar preferências" onPress={() => navigation.navigate('Inicio')} /></View>} />
  </KeyboardAvoidingView></ScreenContainer>;
}
const local = StyleSheet.create({ search: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.paper, borderRadius: 14, paddingHorizontal: 16 }, input: { flex: 1, minHeight: 52, paddingVertical: 12, color: colors.text, fontSize: 16 } });

import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FilterChip, PrimaryButton, ScreenContainer } from '../components/ui';
import { useApp } from '../hooks/useApp';
import { activities } from '../data/activities';
import { filterActivities } from '../utils/activities';
import { colors, styles as s } from '../theme';
import type { TabProps } from '../navigation/types';
import type { Filters } from '../types';
function FilterGroup<T>({ number, title, options, value, onChange }: { number: string; title: string; options: readonly (readonly [T, string])[]; value: T; onChange: (value: T) => void }) {
  return <View style={s.section}><View style={s.row}><Text style={home.number}>{number}</Text><Text style={s.heading}>{title}</Text></View><View style={s.wrap}>{options.map(([item, label]) => <FilterChip key={label} label={label} selected={value === item} onPress={() => onChange(item)} />)}</View></View>;
}
export function HomeScreen({ navigation }: TabProps<'Inicio'>) {
  const { filters, setFilters, draw } = useApp();
  const [noMatch, setNoMatch] = useState(false);
  function change<K extends keyof Filters>(key: K, value: Filters[K]) { setNoMatch(false); setFilters({ ...filters, [key]: value }); }
  function choose() {
    const chosen = draw(filterActivities(activities, filters));
    if (chosen) navigation.navigate('Detalhes', { activityId: chosen.id });
    else setNoMatch(true);
  }
  return <ScreenContainer><ScrollView contentContainerStyle={s.content}>
    <View style={[s.row, { justifyContent: 'space-between' }]}><View style={s.row}><View style={home.logo}><Ionicons name="sparkles" size={21} color="white" /></View><Text style={home.brand}>Bora de quê<Text style={{ color: colors.orange }}>?</Text></Text></View><Text style={home.badge}>TEMPO PRA VOCÊ</Text></View>
    <View style={home.hero}>
      <Text style={home.eyebrow}>MENOS INDECISÃO, MAIS MOMENTOS</Text>
      <Text style={home.headline}>Seu tempo livre merece uma <Text style={{ color: colors.primary }}>boa ideia.</Text></Text>
      <Text style={s.subtitle}>Conte como está seu dia e descubra o que fazer.</Text>
      <Image source={require('../../assets/images/relaxar.png')} style={home.art} accessibilityLabel="Ilustração de uma xícara em uma pausa tranquila" />
      <View style={home.artLabel}><Ionicons name="sunny-outline" size={16} color={colors.primary} /><Text style={home.artLabelText}>Pequenas pausas. Boas histórias.</Text></View>
    </View>
    <View style={s.section}><Text style={s.heading}>Qual é o plano de hoje?</Text><Text style={s.small}>Do seu jeito, no seu tempo.</Text></View>
    <FilterGroup<number | null> number="01" title="Tempo disponível" value={filters.time} onChange={v => change('time', v)} options={[[15, 'Até 15 minutos'], [30, 'Até 30 minutos'], [60, 'Até 1 hora'], [120, 'Até 2 horas'], [null, 'Sem limite']]} />
    <FilterGroup<number | null> number="02" title="Orçamento por pessoa" value={filters.budget} onChange={v => change('budget', v)} options={[[0, 'Grátis'], [20, 'Até R$ 20'], [50, 'Até R$ 50'], [null, 'Sem limite']]} />
    <FilterGroup<Filters['place']> number="03" title="Onde?" value={filters.place} onChange={v => change('place', v)} options={[[ 'casa', 'Em casa'], ['fora', 'Fora de casa'], ['todos', 'Tanto faz']]} />
    <FilterGroup<Filters['company']> number="04" title="Com quem?" value={filters.company} onChange={v => change('company', v)} options={[[ 'sozinho', 'Sozinho'], ['acompanhado', 'Acompanhado'], ['todos', 'Tanto faz']]} />
    <View style={s.section}>{noMatch && <View style={s.panel}><Text accessibilityRole="alert" style={s.body}>Nenhuma atividade combina com todas essas escolhas. Ajuste os filtros acima e tente novamente.</Text></View>}<PrimaryButton title="Encontrar ideias" icon="arrow-forward" onPress={() => navigation.navigate('Sugestoes')} /><PrimaryButton title="Escolha por mim" secondary icon="shuffle" onPress={choose} /><Text style={[s.small, { textAlign: 'center' }]}>Uma boa ideia pode estar a um toque de distância.</Text></View>
  </ScrollView></ScreenContainer>;
}
const home = StyleSheet.create({
  logo: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 23, fontWeight: '800', color: colors.text, letterSpacing: -0.8 }, badge: { fontSize: 8, letterSpacing: 1.1, color: colors.muted, flexShrink: 1, textAlign: 'right' },
  hero: { gap: 14, paddingTop: 12 }, eyebrow: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.6 },
  headline: { fontSize: 36, lineHeight: 42, letterSpacing: -1.5, color: colors.text, fontWeight: '800' },
  art: { width: '100%', height: 158, borderRadius: 22 }, artLabel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }, artLabelText: { color: colors.primary, fontSize: 12 },
  number: { color: colors.primary, backgroundColor: colors.lavender, padding: 6, borderRadius: 8, fontSize: 11, fontWeight: '800' },
});

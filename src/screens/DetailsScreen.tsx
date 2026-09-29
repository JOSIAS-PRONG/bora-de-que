import React, { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { ActivityMetadata } from '../components/ActivityCard';
import { EmptyState, PrimaryButton, ScreenContainer } from '../components/ui';
import { activityById } from '../data/activities';
import { useApp } from '../hooks/useApp';
import { colors, styles as s } from '../theme';
import type { DetailsProps } from '../navigation/types';
export function DetailsScreen({ route, navigation }: DetailsProps) {
  const { favorites, toggleFavorite, complete } = useApp();
  const [confirmed, setConfirmed] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const activity = activityById.get(route.params.activityId);
  if (!activity) return <ScreenContainer details><EmptyState title="Ideia não encontrada" message="Esta atividade não está mais no catálogo." action="Voltar" onAction={() => navigation.goBack()} /></ScreenContainer>;
  const favorite = favorites.includes(activity.id);
  function markComplete() {
    if (activity && complete(activity.id)) {
      setConfirmed(true); setCooldown(true);
      timer.current = setTimeout(() => setCooldown(false), 2000);
    }
  }
  return <ScreenContainer details><ScrollView contentContainerStyle={s.content}>
    <Image source={activity.image} style={{ width: '100%', aspectRatio: 1.65, borderRadius: 24 }} accessibilityLabel={`Ilustração da categoria ${activity.category}`} />
    <View style={s.section}><Text style={{ color: colors.primary, fontSize: 12, letterSpacing: 1.8, fontWeight: '800' }}>{activity.category.toUpperCase()}</Text><Text style={s.title}>{activity.title}</Text><ActivityMetadata activity={activity} /><Text style={s.body}>{activity.description}</Text></View>
    <View style={s.panel}><Text style={s.heading}>Combina com o seu momento</Text><Text style={s.body}>Onde: {activity.places.map(p => p === 'casa' ? 'em casa' : 'fora de casa').join(' ou ')}</Text><Text style={s.body}>Companhia: {activity.company.map(c => c === 'sozinho' ? 'sozinho' : 'acompanhado').join(' ou ')}</Text><Text style={s.small}>Duração e custo por pessoa são estimativas, não preços comerciais atualizados. Materiais que você já possui podem reduzir o custo.</Text></View>
    <View style={s.section}><Text style={s.heading}>Separe por aí</Text>{activity.materials.map(m => <View key={m} style={s.row}><Text style={{ color: colors.primary }}>•</Text><Text style={[s.body, { flex: 1 }]}>{m}</Text></View>)}</View>
    <View style={s.section}><Text style={s.heading}>Bora colocar em prática?</Text>{activity.steps.map((step, index) => <View key={step} style={[s.row, { alignItems: 'flex-start' }]}><Text style={{ color: colors.primary, fontWeight: '800', backgroundColor: colors.lavender, padding: 8, borderRadius: 10 }}>{String(index + 1).padStart(2, '0')}</Text><Text style={[s.body, { flex: 1 }]}>{step}</Text></View>)}</View>
    <View style={s.section}><PrimaryButton title={favorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'} secondary icon={favorite ? 'heart' : 'heart-outline'} onPress={() => toggleFavorite(activity.id)} /><PrimaryButton title={cooldown ? 'Realização registrada!' : 'Já fiz essa!'} icon="checkmark-circle-outline" disabled={cooldown} onPress={markComplete} />
      {confirmed && <View style={s.panel}><Text accessibilityLiveRegion="polite" style={[s.body, { color: colors.green }]}>Boa! Sua realização foi registrada no histórico com data e hora.</Text><PrimaryButton title="Ver meu histórico" secondary onPress={() => navigation.popTo('Tabs', { screen: 'Historico' })} /></View>}
      <Text style={[s.small, { textAlign: 'center' }]}>Você pode registrar esta ideia novamente em outro momento.</Text>
    </View>
  </ScrollView></ScreenContainer>;
}

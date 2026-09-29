import React, { useState } from 'react';
import { FlatList, Image, Modal, Pressable, Text, View, StyleSheet } from 'react-native';
import { EmptyState, IconButton, PageHeading, PrimaryButton, ScreenContainer } from '../components/ui';
import { activityById } from '../data/activities';
import { useApp } from '../hooks/useApp';
import { colors, styles as s } from '../theme';
import type { TabProps } from '../navigation/types';
export function HistoryScreen({ navigation }: TabProps<'Historico'>) {
  const { history, removeEntry } = useApp();
  const [pending, setPending] = useState<string | null>(null);
  const entries = history.filter(h => activityById.has(h.activityId));
  return <ScreenContainer><FlatList data={entries} keyExtractor={h => h.id} contentContainerStyle={s.content}
    ListHeaderComponent={<View style={{ marginBottom: 24 }}><PageHeading eyebrow="MOMENTOS QUE VIRARAM HISTÓRIA" title="Olha o que você já fez" subtitle={`${entries.length} ${entries.length === 1 ? 'atividade realizada' : 'atividades realizadas'} · cada momento conta.`} /></View>}
    renderItem={({ item }) => { const activity = activityById.get(item.activityId)!; return <View style={local.card}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Abrir ${activity.title}`} onPress={() => navigation.navigate('Detalhes', { activityId: activity.id })} style={({ pressed }) => [local.open, { opacity: pressed ? 0.65 : 1 }]}>
        <Image source={activity.image} style={local.image} /><View style={{ flex: 1, gap: 6 }}><Text style={s.heading}>{activity.title}</Text><Text style={s.small}>{new Date(item.date).toLocaleDateString('pt-BR')} às {new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text></View>
      </Pressable><IconButton icon="trash-outline" danger label={`Excluir registro de ${activity.title}`} onPress={() => setPending(item.id)} />
    </View>; }}
    ListEmptyComponent={<EmptyState icon="time-outline" title="Seu primeiro momento vem aí" message="Que tal tirar uma ideia do papel? Suas atividades realizadas aparecerão aqui." action="Encontrar uma ideia" onAction={() => navigation.navigate('Sugestoes')} />} />
    <Modal visible={pending !== null} transparent animationType="fade" onRequestClose={() => setPending(null)}><View style={local.overlay}><View accessibilityViewIsModal style={[s.panel, { width: '100%', maxWidth: 420 }]}><Text style={s.heading}>Excluir este registro?</Text><Text style={s.body}>Somente esta realização será removida. Os outros momentos e seus favoritos continuam salvos.</Text><PrimaryButton title="Manter registro" onPress={() => setPending(null)} /><PrimaryButton title="Excluir registro" secondary onPress={() => { if (pending) removeEntry(pending); setPending(null); }} /></View></View></Modal>
  </ScreenContainer>;
}
const local = StyleSheet.create({ card: { padding: 12, backgroundColor: colors.paper, borderRadius: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 14, gap: 8, flexDirection: 'row', alignItems: 'center' }, open: { flex: 1, gap: 12 }, image: { width: '100%', height: 100, borderRadius: 10 }, overlay: { flex: 1, backgroundColor: '#28233699', alignItems: 'center', justifyContent: 'center', padding: 24 } });

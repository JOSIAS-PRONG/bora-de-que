import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type Activity } from '../types';
import { colors, radius, styles as s } from '../theme';
import { duration, price } from '../utils/activities';
import { IconButton } from './ui';
import { useApp } from '../hooks/useApp';
export function ActivityMetadata({ activity }: { activity: Activity }) {
  return <View style={s.wrap}><View style={s.row}><Ionicons name="time-outline" size={15} color={colors.muted} /><Text style={s.small}>{duration(activity.duration)}</Text></View><Text style={s.small}>·</Text><Text style={[s.small, { color: activity.cost === 0 ? colors.green : colors.muted }]}>{price(activity.cost)}{activity.cost > 0 ? ' / pessoa' : ''}</Text></View>;
}
export function ActivityCard({ activity, onOpen }: { activity: Activity; onOpen: () => void }) {
  const { favorites, toggleFavorite } = useApp();
  const favorite = favorites.includes(activity.id);
  return <View style={card.container}>
    <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel={`Ver detalhes: ${activity.title}`} style={({ pressed }) => [card.open, { opacity: pressed ? 0.75 : 1 }]}>
      <Image source={activity.image} style={card.image} accessibilityIgnoresInvertColors />
      <View style={card.text}><Text style={card.category}>{activity.category.toUpperCase()}</Text><Text style={card.title}>{activity.title}</Text><ActivityMetadata activity={activity} /></View>
    </Pressable>
    <View style={card.favorite}><IconButton icon={favorite ? 'heart' : 'heart-outline'} label={`${favorite ? 'Remover dos' : 'Adicionar aos'} favoritos: ${activity.title}`} active={favorite} onPress={() => toggleFavorite(activity.id)} /></View>
  </View>;
}
const card = StyleSheet.create({
  container: { backgroundColor: colors.paper, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginBottom: 16, overflow: 'hidden' },
  open: { flex: 1 }, image: { width: '100%', height: 160, resizeMode: 'cover' },
  text: { padding: 18, gap: 9 }, category: { fontSize: 10, letterSpacing: 1.6, color: colors.primary, fontWeight: '800' },
  title: { fontSize: 20, lineHeight: 26, fontWeight: '700', color: colors.text }, favorite: { position: 'absolute', top: 12, right: 12 },
});

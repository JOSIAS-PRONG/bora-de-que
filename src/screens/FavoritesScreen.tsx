import React from 'react';
import { FlatList, View } from 'react-native';
import { ActivityCard } from '../components/ActivityCard';
import { EmptyState, PageHeading, ScreenContainer } from '../components/ui';
import { activities } from '../data/activities';
import { useApp } from '../hooks/useApp';
import { styles as s } from '../theme';
import type { TabProps } from '../navigation/types';
export function FavoritesScreen({ navigation }: TabProps<'Favoritos'>) {
  const { favorites } = useApp();
  const saved = activities.filter(a => favorites.includes(a.id));
  return <ScreenContainer><FlatList data={saved} keyExtractor={a => a.id} contentContainerStyle={s.content}
    ListHeaderComponent={<View style={{ marginBottom: 24 }}><PageHeading eyebrow="GUARDE O QUE TE INSPIRA" title="Seus favoritos" subtitle={`${saved.length} ${saved.length === 1 ? 'ideia salva' : 'ideias salvas'} para quando der vontade.`} /></View>}
    renderItem={({ item }) => <ActivityCard activity={item} onOpen={() => navigation.navigate('Detalhes', { activityId: item.id })} />}
    ListEmptyComponent={<EmptyState icon="heart-outline" title="Um lugar para suas boas ideias" message="Suas próximas ideias favoritas vão aparecer aqui." action="Explorar sugestões" onAction={() => navigation.navigate('Sugestoes')} />} />
  </ScreenContainer>;
}

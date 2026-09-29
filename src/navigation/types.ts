import type { NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
export type TabParamList = { Inicio: undefined; Sugestoes: undefined; Favoritos: undefined; Historico: undefined };
export type RootParamList = { Tabs: NavigatorScreenParams<TabParamList> | undefined; Detalhes: { activityId: string } };
export type TabProps<T extends keyof TabParamList> = CompositeScreenProps<BottomTabScreenProps<TabParamList, T>, NativeStackScreenProps<RootParamList>>;
export type DetailsProps = NativeStackScreenProps<RootParamList, 'Detalhes'>;

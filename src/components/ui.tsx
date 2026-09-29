import React, { type PropsWithChildren, type ComponentProps } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, styles as s } from '../theme';
export type IconName = ComponentProps<typeof Ionicons>['name'];
export function PrimaryButton({ title, onPress, secondary = false, icon, disabled = false }: { title: string; onPress: () => void; secondary?: boolean; icon?: IconName; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [ui.button, secondary && ui.secondary, { opacity: disabled ? 0.45 : pressed ? 0.72 : 1 }]}>
    {icon && <Ionicons name={icon} size={21} color={secondary ? colors.primary : '#fff'} />}
    <Text style={[ui.buttonText, secondary && { color: colors.primary }]}>{title}</Text>
  </Pressable>;
}
export function FilterChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={({ pressed }) => [ui.chip, selected && ui.selected, { opacity: pressed ? 0.65 : 1 }]}>
    {selected && <Ionicons name="checkmark" size={16} color={colors.primary} />}
    <Text style={[ui.chipText, selected && { color: colors.primary, fontWeight: '700' }]}>{label}</Text>
  </Pressable>;
}
export function IconButton({ icon, label, onPress, active = false, danger = false }: { icon: IconName; label: string; onPress: () => void; active?: boolean; danger?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: active }} onPress={onPress} style={({ pressed }) => [ui.iconButton, { opacity: pressed ? 0.6 : 1, backgroundColor: active ? colors.lavender : colors.background }]}>
    <Ionicons name={icon} size={23} color={danger ? colors.danger : colors.primary} />
  </Pressable>;
}
export function EmptyState({ title, message, action, onAction, icon = 'sparkles-outline' }: { title: string; message: string; action?: string; onAction?: () => void; icon?: IconName }) {
  return <View style={ui.empty}><View style={ui.emptyIcon}><Ionicons name={icon} size={36} color={colors.primary} /></View><Text style={[s.heading, { textAlign: 'center' }]}>{title}</Text><Text style={[s.subtitle, { textAlign: 'center' }]}>{message}</Text>{action && onAction && <PrimaryButton title={action} onPress={onAction} secondary />}</View>;
}
export function ScreenContainer({ children, details = false }: PropsWithChildren<{ details?: boolean }>) {
  return <SafeAreaView edges={details ? ['left', 'right', 'bottom'] : ['top', 'left', 'right']} style={s.page}>{children}</SafeAreaView>;
}
export function PageHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <View style={s.section}><Text style={ui.eyebrow}>{eyebrow.toUpperCase()}</Text><Text style={s.title}>{title}</Text><Text style={s.subtitle}>{subtitle}</Text></View>;
}
const ui = StyleSheet.create({
  button: { minHeight: 54, paddingVertical: 15, paddingHorizontal: 20, borderRadius: radius.sm, backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9 },
  secondary: { backgroundColor: colors.lavender }, buttonText: { color: '#fff', fontWeight: '700', fontSize: 16, flexShrink: 1, textAlign: 'center' },
  chip: { minHeight: 44, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 13, paddingVertical: 11, backgroundColor: colors.paper, flexDirection: 'row', alignItems: 'center', gap: 5 },
  selected: { borderColor: colors.primary, backgroundColor: colors.lavender }, chipText: { color: colors.muted, fontSize: 14 },
  iconButton: { minWidth: 46, minHeight: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', gap: 18, paddingVertical: 36, paddingHorizontal: 12 }, emptyIcon: { padding: 22, borderRadius: 40, backgroundColor: colors.lavender },
  eyebrow: { fontSize: 11, letterSpacing: 2, fontWeight: '800', color: colors.primary },
});

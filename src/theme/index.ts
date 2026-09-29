import { StyleSheet } from 'react-native';
export const colors = { background: '#FAF8F5', paper: '#FFFFFF', primary: '#6336BF', primaryDark: '#43217F', lavender: '#EEE7FA', orange: '#F19A58', peach: '#FFF0E3', text: '#282336', muted: '#746C80', border: '#E6DFEA', danger: '#B23845', green: '#3D7157' };
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { sm: 12, md: 20, lg: 28 };
export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 36, width: '100%', maxWidth: 720, alignSelf: 'center' },
  title: { fontSize: 30, fontWeight: '800', color: colors.text, letterSpacing: -1 },
  subtitle: { fontSize: 16, color: colors.muted, lineHeight: 24 },
  heading: { fontSize: 19, fontWeight: '700', color: colors.text },
  body: { fontSize: 16, color: colors.text, lineHeight: 25 },
  small: { fontSize: 13, color: colors.muted, lineHeight: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  section: { gap: 12 },
  panel: { backgroundColor: colors.paper, padding: 20, borderRadius: radius.md, gap: 12, borderWidth: 1, borderColor: colors.border },
});

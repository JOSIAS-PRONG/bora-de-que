import { Alert, Linking, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Directory, File, Paths } from 'expo-file-system';

export function photoUri(path: string) {
  return path.includes('://') ? path : new File(Paths.document, 'history-photos', path).uri;
}
export function removePhoto(path?: string | null) {
  if (!path) return;
  try {
    const file = new File(photoUri(path));
    if (file.uri.startsWith(new Directory(Paths.document, 'history-photos').uri) && file.exists) file.delete();
  } catch { /* A failed cleanup must not undo a confirmed database change. */ }
}
export async function takePhoto(): Promise<string | null> {
  if (Platform.OS === 'web') { Alert.alert('Câmera', 'Use o Expo Go no celular para fotografar.'); return null; }
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permissão de câmera', 'Permita o acesso à câmera para fotografar esta atividade.',
      permission.canAskAgain ? [{ text: 'OK' }] : [{ text: 'Cancelar' }, { text: 'Abrir configurações', onPress: () => { void Linking.openSettings(); } }]);
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1, allowsEditing: false });
  if (result.canceled || !result.assets?.[0]) return null;
  const asset = result.assets[0];
  const context = ImageManipulator.manipulate(asset.uri);
  context.resize({ width: Math.min(asset.width, 1200) });
  const rendered = await context.renderAsync();
  const compressed = await rendered.saveAsync({ compress: 0.7, format: SaveFormat.JPEG });
  const directory = new Directory(Paths.document, 'history-photos');
  directory.create({ idempotent: true, intermediates: true });
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  try { new File(compressed.uri).copy(new File(directory, filename)); }
  catch (error) { removePhoto(filename); throw error; }
  // Store a relative path: the application document root may change after an update.
  return filename;
}

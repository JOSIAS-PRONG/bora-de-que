import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import axios from 'axios';
import { PrimaryButton } from './ui';
import { colors, styles as s } from '../theme';

const ENDPOINT = 'https://www.themealdb.com/api/json/v1/1/random.php';
type Recipe = { idMeal: string; strMeal: string; strMealThumb: string; strInstructions: string };

async function translateToPortuguese(text: string, signal?: AbortSignal): Promise<string> {
  if (!text || !text.trim()) return text;
  try {
    const res = await axios.get('https://translate.googleapis.com/translate_a/single', {
      params: { client: 'gtx', sl: 'auto', tl: 'pt', dt: 't', q: text },
      timeout: 10000,
      signal,
    });
    if (Array.isArray(res.data?.[0])) {
      const translated = res.data[0].map((item: any) => item[0]).join('');
      return translated.trim() || text;
    }
    return text;
  } catch {
    return text;
  }
}

export function RecipeSection() {
  const [attempt, setAttempt] = useState(0);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(false); setImageError(false); setRecipe(null); setExpanded(false);
    axios.get<{ meals: Recipe[] | null }>(ENDPOINT, { signal: controller.signal, timeout: 15000 })
      .then(async ({ data }) => {
        const item = data.meals?.[0];
        if (!item || typeof item.strMeal !== 'string' || !item.strMeal.trim()
          || typeof item.strMealThumb !== 'string' || !item.strMealThumb.startsWith('https://')
          || typeof item.strInstructions !== 'string' || !item.strInstructions.trim()) throw new Error('Resposta inválida');
        
        const [translatedTitle, translatedInstructions] = await Promise.all([
          translateToPortuguese(item.strMeal, controller.signal),
          translateToPortuguese(item.strInstructions, controller.signal),
        ]);

        if (!controller.signal.aborted) {
          setRecipe({
            ...item,
            strMeal: translatedTitle || item.strMeal,
            strInstructions: translatedInstructions || item.strInstructions,
          });
        }
      }).catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);
  return <View style={s.panel}>
    <Text style={s.heading}>Ideias para cozinhar</Text>
    <Text style={s.small}>Receita do TheMealDB traduzida para português. Esta seção não usa os filtros das atividades.</Text>
    {loading && <><ActivityIndicator color={colors.primary} /><Text style={s.small}>Buscando e traduzindo receita…</Text></>}
    {error && <><Text accessibilityRole="alert" style={s.body}>Não foi possível carregar a receita. Verifique sua conexão.</Text><PrimaryButton title="Tentar novamente" secondary onPress={() => setAttempt(a => a + 1)} /></>}
    {recipe && <>
      <Text style={s.heading}>{recipe.strMeal}</Text>
      <Image key={`${attempt}-${recipe.strMealThumb}`} source={{ uri: recipe.strMealThumb }} accessibilityLabel={recipe.strMeal} style={{ width: '100%', height: 180, borderRadius: 14 }} onError={() => setImageError(true)} />
      {imageError && <><Text style={s.small}>Não foi possível carregar a imagem.</Text><PrimaryButton title="Tentar novamente" secondary onPress={() => setAttempt(a => a + 1)} /></>}
      <PrimaryButton title={expanded ? 'Ocultar instruções' : 'Ver instruções'} secondary onPress={() => setExpanded(v => !v)} />
      {expanded && <Text style={s.body}>{recipe.strInstructions}</Text>}
    </>}
  </View>;
}

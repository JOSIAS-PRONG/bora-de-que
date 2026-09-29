# Bora de quê?

Aplicativo de Interface Mobile que transforma tempo livre em uma boa ideia. Escolha tempo disponível, orçamento por pessoa, local e companhia; receba sugestões de um catálogo local com 28 atividades.

## Funcionalidades

- Início com quatro filtros cumulativos e valores iniciais de até uma hora, grátis e qualquer local/companhia.
- Sugestões com busca por título sem distinção de acentos/maiúsculas, categoria e contagem de resultados.
- Sorteio restrito aos resultados atuais, evitando repetição imediata quando há alternativas.
- Detalhes com ilustração, materiais, passos, ambientes e companhia compatíveis.
- Favoritos compartilhados entre telas e histórico com data/hora brasileira.
- Registro de uma mesma atividade em momentos diferentes, com bloqueio de toques repetidos por dois segundos.
- Exclusão individual de realizações mediante confirmação.
- Persistência local, estados vazios, carregamento inicial e avisos de falha ao salvar.

## Tecnologias e compatibilidade

React Native 0.86.3, React 19.2.3, Expo SDK 57, TypeScript, React Navigation 7 (NavigationContainer, Bottom Tabs e Native Stack), Context API, AsyncStorage e Ionicons via @expo/vector-icons. Sem Expo Router, backend, login ou chamadas de API no aplicativo.

As versões foram consultadas no registro npm e alinhadas com `npx expo install`. Referências: [compatibilidade do Expo](https://docs.expo.dev/versions/latest/), [Expo Go](https://expo.dev/go) e [React Navigation](https://reactnavigation.org/docs/getting-started/).

Pré-requisitos recomendados: Node.js 22.13 ou superior da série 22 LTS, npm, Expo Go compatível com SDK 57 e celular Android 7+ ou iOS 16.4+. O projeto inclui Node 22 como dependência de desenvolvimento para executar os scripts npm mesmo no computador originalmente equipado com Node 20; isso não altera o Node instalado no sistema. Use Node 22 no sistema em novas instalações para seguir o requisito oficial do SDK.

## Instalar e iniciar

Abra um terminal nesta pasta e execute:

```sh
npm ci
npm start
```

As dependências já foram instaladas durante a implementação. Neste computador, basta executar `npm start`.

No Android, abra o Expo Go e use a opção de ler QR code. No iPhone, leia o QR code com a Câmera e abra no Expo Go. Computador e celular devem estar na mesma rede Wi-Fi, com comunicação entre dispositivos permitida. Se aparecer incompatibilidade de SDK, consulte https://expo.dev/go e use a versão correspondente ao SDK 57.

Se a rede bloquear a conexão local, pare o servidor com Ctrl+C e use:

```sh
npm start -- --tunnel
```

A CLI poderá solicitar a instalação do suporte de túnel `@expo/ngrok`. O túnel requer internet e pode ser mais lento. Se preferir instalá-lo explicitamente no projeto: `npm install --save-dev @expo/ngrok`.

Alternativas:

```sh
npm run web
npm run android
npm run ios
```

`android` requer emulador configurado ou aparelho com depuração USB; `ios` para simulador requer macOS/Xcode. O QR code funciona com aparelhos físicos sem compilar um aplicativo nativo.

## Estrutura

```text
App.tsx                     Providers, carregamento e aviso de armazenamento
src/
  components/               ActivityCard, ActivityMetadata e elementos reutilizáveis
  screens/                  Início, Sugestões, Detalhes, Favoritos e Histórico
  navigation/               Bottom Tabs, Native Stack e tipos de rotas
  context/                  Estado global, hidratação e operações de escrita
  hooks/                    useApp
  data/                     Catálogo local de 28 atividades
  types/                    Activity, Filters, HistoryEntry e SavedState
  utils/                    Filtros, busca, sorteio e validação de dados salvos
  services/                 AsyncStorage com chave versionada e fila de gravação
  theme/                    Cores, espaçamentos, raios e estilos compartilhados
assets/images/              Sete ilustrações locais por categoria e ícone
scripts/create-art.ps1      Fonte das ilustrações geométricas, desenhadas para o projeto
tests/                      Testes automatizados das regras e dados
ROTEIRO_DEMONSTRACAO.md      Roteiro de aproximadamente três minutos
VALIDACAO.md                Verificações executadas e limites da validação
```

## Persistência e regras

A chave `@bora-de-que/state/v1` guarda um objeto JSON com IDs de favoritos, filtros e registros de histórico. Cada realização tem ID próprio, ID da atividade e data ISO. As telas só ficam disponíveis após a leitura inicial. O carregamento não grava os valores padrão sobre o conteúdo existente.

Gravações são enfileiradas para preservar a ordem das mudanças. Falhas exibem um aviso de que a alteração pode não permanecer ao reabrir. Valores inválidos usam padrões seguros; IDs de atividades removidas e registros inválidos são ignorados. JSON ilegível ou falha de leitura gera aviso e permite continuar; alterações posteriores salvam o estado recuperado. Imagens não são armazenadas no AsyncStorage.

Favoritos e histórico não dependem dos filtros. A aba Sugestões usa sempre os filtros atuais. Tempo e custo são limites inclusivos; `null` desativa apenas seu próprio limite. Busca e categoria também restringem o sorteio da tela de sugestões. O último sorteio é compartilhado entre as telas, mas não precisa persistir entre sessões.

## Validação automática

```sh
npm run typecheck
npm test
npx expo install --check
npx expo-doctor
npx expo export --platform all
```

O bundle é gerado localmente em `dist/`; esse comando não publica nada. Não há configuração de lint neste projeto. Consulte `VALIDACAO.md` para os resultados reais.

## Checklist de teste no celular

- [ ] Abrir no Expo Go compatível e verificar ausência de tela de erro.
- [ ] Conferir valores iniciais em uma instalação sem dados.
- [ ] Selecionar até 15 minutos, grátis, fora de casa e acompanhado; conferir sugestões compatíveis.
- [ ] Abrir detalhes e voltar à aba de origem usando a seta e o botão Voltar do Android.
- [ ] Alterar filtros, trocar de aba e conferir que as escolhas permanecem.
- [ ] Buscar `praca` e encontrar `Um respiro na praça` quando os filtros permitirem.
- [ ] Combinar busca e categoria, sortear e confirmar que o resultado pertence à lista.
- [ ] Sortear duas vezes com várias candidatas e verificar ausência de repetição imediata.
- [ ] Buscar texto inexistente; limpar busca/categoria e alterar preferências no estado vazio.
- [ ] Selecionar até 15 minutos, grátis, fora de casa e sozinho e buscar `caminhada`: sortear a única opção sem erro.
- [ ] Favoritar pelo coração do cartão e confirmar que os detalhes não abrem acidentalmente.
- [ ] Abrir favoritos, acessar detalhes, remover favorito e conferir atualização nas demais telas.
- [ ] Tocar rapidamente em `Já fiz essa!` e confirmar um único registro.
- [ ] Esperar dois segundos, registrar novamente e verificar dois registros independentes.
- [ ] Abrir Histórico, cancelar exclusão e verificar que nada mudou; depois excluir somente um registro.
- [ ] Fechar o projeto, reabri-lo e conferir favoritos, filtros e histórico salvos.
- [ ] Após carregar o projeto e as imagens, desligar a internet e navegar nas telas, filtrar e sortear.
- [ ] Verificar rolagem em tela pequena, teclado na busca, fonte ampliada, TalkBack/VoiceOver e áreas seguras.
- [ ] Esvaziar favoritos e histórico e conferir os textos de orientação.

## Requisitos acadêmicos e arquivos

| Requisito | Demonstração |
| --- | --- |
| React Native, Expo, TypeScript | `package.json`, `app.json`, `App.tsx`, `tsconfig.json` |
| Componentes funcionais | Todos os componentes de `src/screens/` e `src/components/` |
| Props | `ActivityCard` recebe `activity` e `onOpen`; `FilterChip` recebe seleção e callback |
| State e hooks | `SuggestionsScreen` mantém busca/categoria; `AppContext` mantém dados compartilhados |
| View, Text, Image, Pressable | `ActivityCard.tsx`, `ui.tsx`, `HomeScreen.tsx` |
| ScrollView | `HomeScreen.tsx`, `DetailsScreen.tsx` |
| StyleSheet e Flexbox | `src/theme/index.ts` e estilos dos componentes |
| FlatList | Sugestões, Favoritos e Histórico, sem ScrollView vertical envolvendo as listas |
| React Navigation | `src/navigation/AppNavigator.tsx` e `types.ts` |
| Estado global e persistência | `AppContext.tsx`, `useApp.ts`, `storage.ts`, `savedState.ts` |
| Funções puras | `src/utils/activities.ts`, verificadas em `tests/` |
| Acessibilidade e feedback | `ui.tsx`, estados selecionados, rótulos de ícones e áreas seguras |
| Imagens locais e modo offline | `assets/images/`, referências estáticas no catálogo |

## Limitações conhecidas

O catálogo é fixo e não consulta estabelecimentos, eventos ou preços. Custos e tempos são estimativas. Atividades gratuitas que usam materiais pressupõem que eles já estejam disponíveis. Não há sincronização entre dispositivos, conta, mapa, GPS ou notificações. A busca local por texto/categoria é estado de tela e não é persistida; os quatro filtros principais são persistidos.

As sugestões funcionam sem internet depois de carregadas. Abrir/recarregar o projeto no Expo Go durante desenvolvimento ainda pode exigir conexão com o servidor do computador. Limpar os dados/desinstalar o Expo Go pode apagar o armazenamento. A versão web usa o armazenamento do navegador e serve como alternativa de desenvolvimento, não substitui a validação no aparelho.

## Entrega no GitHub e vídeo

Nenhum comando Git, commit, push ou publicação foi executado. Para entregar, crie você mesmo um repositório no GitHub, envie os fontes, `package.json`, `package-lock.json`, imagens, testes e documentação. O `.gitignore` exclui `node_modules/`, `.expo/` e `dist/`. Não envie essas pastas nem arquivos de credenciais.

Você pode usar o GitHub Desktop para adicionar esta pasta como repositório local, revisar os arquivos, criar seu commit e publicar quando estiver pronto. Grave a tela do celular seguindo `ROTEIRO_DEMONSTRACAO.md`; informe no trabalho o link do repositório e o link do vídeo conforme as regras da disciplina.

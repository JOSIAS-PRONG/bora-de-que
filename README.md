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

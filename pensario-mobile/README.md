# Pensário Mobile - React Native

Aplicativo de anotações desenvolvido com React Native e Expo, permitindo execução em dispositivos Android.

## 📱 Funcionalidades

- ✅ Criar, editar e excluir anotações
- ✅ Categorizar anotações (Pessoal, Trabalho, Estudos, Lembretes, Médico, Outros)
- ✅ Adicionar datas de consulta para categorias Médico e Outros
- ✅ Armazenamento local com AsyncStorage
- ✅ Interface intuitiva e responsiva
- ✅ Ordenação automática de notas

## 🚀 Como Rodar o Projeto

### Pré-requisitos

1. **Node.js** (versão 18 ou superior)
   - Baixe em: https://nodejs.org/

2. **Expo Go** no seu celular Android
   - Baixe na Google Play Store: https://play.google.com/store/apps/details?id=host.exp.exponent

### Instalação

1. Clone ou extraia o projeto
2. Navegue até a pasta do projeto:
   ```bash
   cd pensario-mobile
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

### Executar no Celular (Desenvolvimento)

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
   ou
   ```bash
   npx expo start
   ```

2. Um QR Code aparecerá no terminal

3. Abra o aplicativo **Expo Go** no seu celular Android

4. Escaneie o QR Code com o aplicativo Expo Go

5. O aplicativo será carregado no seu celular!

**Importante:** Certifique-se de que seu computador e celular estejam na mesma rede Wi-Fi.

## 📦 Gerar APK para Instalação

Para gerar um arquivo APK que pode ser instalado diretamente no Android:

### Opção 1: Build Local (Requer Android Studio)

1. Instale o Android Studio e configure o ambiente Android
2. Execute:
   ```bash
   npx expo run:android
   ```

### Opção 2: Build na Nuvem com EAS (Recomendado)

1. Crie uma conta gratuita no Expo: https://expo.dev/

2. Faça login no EAS CLI:
   ```bash
   npx eas login
   ```

3. Configure o projeto:
   ```bash
   npx eas build:configure
   ```

4. Gere o APK:
   ```bash
   npx eas build -p android --profile preview
   ```

5. Aguarde o build ser concluído (pode levar alguns minutos)

6. Baixe o APK gerado através do link fornecido

7. Transfira o APK para seu celular e instale

**Nota:** A conta gratuita do Expo permite builds limitados por mês.

## 📱 Instalar o APK no Android

1. Baixe o arquivo APK gerado
2. Transfira para seu celular Android
3. Abra o arquivo APK no celular
4. Permita a instalação de fontes desconhecidas (se solicitado)
5. Instale o aplicativo

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **AsyncStorage** - Armazenamento local persistente
- **MaterialIcons** - Ícones do Material Design

## 📂 Estrutura do Projeto

```
pensario-mobile/
├── App.js              # Componente principal do aplicativo
├── app.json            # Configurações do Expo
├── eas.json            # Configurações de build
├── package.json        # Dependências do projeto
└── assets/             # Ícones e imagens
```

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run android` - Executa no emulador/dispositivo Android
- `npm run ios` - Executa no emulador/dispositivo iOS (apenas macOS)
- `npm run web` - Executa no navegador web

## 📝 Notas Importantes

- O aplicativo armazena os dados localmente no dispositivo
- Os dados não são sincronizados entre dispositivos
- Para backup, você precisará implementar sincronização com servidor

## 🐛 Solução de Problemas

### O QR Code não funciona
- Verifique se o computador e celular estão na mesma rede Wi-Fi
- Tente usar o modo "Tunnel" no Expo: `npx expo start --tunnel`

### Erro ao instalar dependências
- Limpe o cache: `npm cache clean --force`
- Delete a pasta `node_modules` e `package-lock.json`
- Execute `npm install` novamente

### Aplicativo não abre no celular
- Verifique se o Expo Go está atualizado
- Reinicie o servidor de desenvolvimento
- Limpe o cache do Expo: `npx expo start -c`

## 📄 Licença

Este projeto é de código aberto e está disponível para uso pessoal e comercial.

## 👨‍💻 Suporte

Para dúvidas ou problemas, consulte a documentação oficial:
- Expo: https://docs.expo.dev/
- React Native: https://reactnative.dev/docs/getting-started

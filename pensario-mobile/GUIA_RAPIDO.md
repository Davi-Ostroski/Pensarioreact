# 🚀 Guia Rápido - Pensário Mobile

## Para Testar Imediatamente no Celular

### 1️⃣ Instale o Expo Go
- Abra a **Google Play Store** no seu Android
- Busque por **"Expo Go"**
- Instale o aplicativo

### 2️⃣ No Computador
```bash
cd pensario-mobile
npm install
npm start
```

### 3️⃣ No Celular
- Abra o **Expo Go**
- Escaneie o QR Code que apareceu no terminal
- Pronto! O app vai carregar no seu celular

**⚠️ IMPORTANTE:** Computador e celular devem estar na mesma rede Wi-Fi!

---

## Para Gerar APK e Instalar Permanentemente

### Método Simples (EAS Build - Nuvem)

#### 1️⃣ Criar Conta Expo
- Acesse: https://expo.dev/signup
- Crie uma conta gratuita

#### 2️⃣ Fazer Login
```bash
npx eas login
```

#### 3️⃣ Gerar APK
```bash
npx eas build -p android --profile preview
```

#### 4️⃣ Aguardar
- O build será feito na nuvem (5-15 minutos)
- Você receberá um link para baixar o APK

#### 5️⃣ Instalar
- Baixe o APK no seu celular
- Abra o arquivo
- Permita instalação de fontes desconhecidas
- Instale!

---

## Comandos Úteis

### Iniciar o projeto
```bash
npm start
```

### Limpar cache e reiniciar
```bash
npx expo start -c
```

### Ver logs do dispositivo
```bash
npx expo start --dev-client
```

---

## Problemas Comuns

### ❌ QR Code não funciona
**Solução:** Use o modo tunnel
```bash
npx expo start --tunnel
```

### ❌ Erro ao instalar dependências
**Solução:** Limpe e reinstale
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ App não abre no Expo Go
**Solução:** Atualize o Expo Go na Play Store

---

## Estrutura de Pastas

```
pensario-mobile/
├── App.js              ← Código principal do app
├── app.json            ← Configurações do Expo
├── eas.json            ← Configurações de build
├── package.json        ← Dependências
└── README.md           ← Documentação completa
```

---

## Próximos Passos

1. **Testar no Expo Go** (mais rápido para desenvolvimento)
2. **Gerar APK** quando quiser instalar permanentemente
3. **Publicar na Play Store** (opcional, requer conta de desenvolvedor)

---

## Links Úteis

- 📱 Expo Go: https://expo.dev/go
- 📚 Documentação Expo: https://docs.expo.dev/
- 🏗️ EAS Build: https://docs.expo.dev/build/introduction/
- 🎨 Ícones: https://icons.expo.fyi/

---

## Dicas

✅ Use o Expo Go para desenvolvimento rápido  
✅ Gere APK apenas quando precisar instalar permanentemente  
✅ Mantenha o Expo Go sempre atualizado  
✅ Use `npm start` para iniciar o servidor  
✅ Pressione `r` no terminal para recarregar o app  

---

**Desenvolvido com React Native + Expo** 🚀

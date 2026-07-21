# ✅ FASE 2 - CHECKLIST DE TESTES

## 📋 Antes de Começar

- [ ] Arquivo `EXECUTAR_NO_SUPABASE.sql` copiado
- [ ] Supabase aberto em nova aba
- [ ] Projeto Next.js rodando em http://localhost:3000

---

## 🚀 TESTE 1: Criar Tabela no Supabase

### Passos:
1. [ ] Acesse https://supabase.com e entre no seu projeto
2. [ ] Vá para: **SQL Editor** (menu esquerdo)
3. [ ] Clique em **"New Query"** (topo)
4. [ ] Cole o SQL do arquivo `EXECUTAR_NO_SUPABASE.sql`
5. [ ] Clique em **"Run"** (botão verde canto superior direito)
6. [ ] Verifique se mensagem fica verde: **"Query executed successfully"**

### Esperado:
```
✅ Query executed successfully
```

### Se tiver erro:
```
❌ ERROR: relation "dp_configuracao" already exists
// Significa que a tabela já existe (pode ignorar)

❌ ERROR: syntax error
// Volte para este checklist, passo 4
```

---

## 🌐 TESTE 2: Acessar Página de Configuração

### Passos:
1. [ ] Abra http://localhost:3000 no navegador
2. [ ] Clique no card **"Sou DP"** ⚙️ (tela inicial)
3. [ ] Faça login (email/senha)
4. [ ] Clique em **"⚙️ Configuração"** no menu lateral (coluna direita)
5. [ ] Verifique se carregou a página

### Esperado:
```
✅ URL muda para: http://localhost:3000/dp/configuracao
✅ Página carrega com header "Configuração de Recebimento"
✅ 3 seções visíveis:
   - Ativar/Desativar Recebimento
   - Dias da Semana (7 checkboxes)
   - Horário de Funcionamento (2 inputs time)
✅ Botão "💾 Salvar Configuração" no final
```

### Se não carregou:
```
❌ Erro de conexão?
   → Verifique se Next.js está rodando (npm run dev)
   
❌ Página branca/vazia?
   → Abra console (F12) e veja erros
   
❌ 404 Not Found?
   → Verifique se arquivo foi criado em app/dp/configuracao/page.tsx
```

---

## ✅ TESTE 3: Testar Configuração de Dias

### Passos:
1. [ ] Certifique-se de estar em http://localhost:3000/dp/configuracao
2. [ ] Verifique os checkboxes:
   - [ ] Segunda: ✅ (marcada)
   - [ ] Terça: ✅ (marcada)
   - [ ] Quarta: ✅ (marcada)
   - [ ] Quinta: ✅ (marcada)
   - [ ] Sexta: ✅ (marcada)
   - [ ] Sábado: ❌ (desmarcada)
   - [ ] Domingo: ❌ (desmarcada)
3. [ ] **Desmarque** "Sábado" e "Domingo" (se já estiverem desmarcados, passe)
4. [ ] Marque "Domingo" (teste novo estado)
5. [ ] Clique em **"💾 Salvar Configuração"**
6. [ ] Verifique se aparece mensagem verde: **"✅ Configuração salva com sucesso!"**
7. [ ] Aguarde 3 segundos (mensagem desaparece automaticamente)
8. [ ] **Recarregue a página** (Ctrl+R ou F5)
9. [ ] Verifique se "Domingo" continua marcado (dados persistiram)

### Esperado:
```
✅ Checkbox "Domingo" fica marcado
✅ Mensagem verde aparece e desaparece
✅ Após recarregar, continua marcado
✅ Alterações foram salvas no banco
```

### Se falhou:
```
❌ Mensagem vermelha (erro)?
   → Verifique console (F12)
   → Tabela foi criada no Supabase?
   
❌ Dados não persistem após recarregar?
   → API GET não está buscando dados
   → Verifique arquivo: app/api/dp/configuracao/route.ts
   
❌ Botão fica travado (não volta ao normal)?
   → Erro na API POST
   → Verifique console para detalhes
```

---

## ⏰ TESTE 4: Testar Horários

### Passos:
1. [ ] Certifique-se de estar em http://localhost:3000/dp/configuracao
2. [ ] Verifique horários atuais:
   - [ ] Horário Inicial: 09:00
   - [ ] Horário Final: 17:00
   - [ ] Exibição: "Janela de funcionamento: 09:00 até 17:00"
3. [ ] **Mude Horário Inicial** para: **08:00**
4. [ ] **Mude Horário Final** para: **18:30**
5. [ ] Verifique se exibição mudou: "Janela de funcionamento: 08:00 até 18:30"
6. [ ] Clique em **"💾 Salvar Configuração"**
7. [ ] Verifique mensagem verde
8. [ ] **Recarregue a página** (Ctrl+R)
9. [ ] Confirme que horários continuam: 08:00 e 18:30

### Esperado:
```
✅ Inputs aceitam formato HH:MM
✅ Exibição "Janela de funcionamento" atualiza em tempo real
✅ Salvamento com sucesso (mensagem verde)
✅ Dados persistem após recarregar
```

### Se falhou:
```
❌ Input não aceita horário?
   → Type é "time", deve aceitar HH:MM
   → Teste manualmente: clique e escolha horário
   
❌ Horários são resetados ao recarregar?
   → GET não está retornando dados salvos
   → Verifique Supabase: table "dp_configuracao"
   
❌ Erro de validação?
   → Verifique se formato é exatamente HH:MM (não 8:0)
```

---

## 🔘 TESTE 5: Testar Toggle Recebimento

### Passos:
1. [ ] Certifique-se de estar em http://localhost:3000/dp/configuracao
2. [ ] Verifique status inicial:
   - [ ] Toggle verde (ativo)
   - [ ] Texto: "✅ Recebimento de documentos ativo"
3. [ ] **Clique no toggle** (botão redondo)
4. [ ] Verifique novo status:
   - [ ] Toggle vermelho (inativo)
   - [ ] Texto: "❌ Recebimento de documentos desativado"
5. [ ] Clique em **"💾 Salvar Configuração"**
6. [ ] Verifique mensagem verde
7. [ ] **Recarregue a página** (Ctrl+R)
8. [ ] Confirme que toggle continua vermelho (desativado)
9. [ ] **Clique novamente no toggle** para reativar
10. [ ] Salve e recarregue novamente
11. [ ] Confirme que ficou verde (ativo)

### Esperado:
```
✅ Toggle muda de cor (verde/vermelho)
✅ Texto muda (ativo/desativado)
✅ Estado persiste após recarregar
✅ Pode alternar várias vezes
```

### Se falhou:
```
❌ Toggle não muda de cor?
   → Verifique component ToggleBotao
   → Estilo CSS pode estar errado
   
❌ Estado não persiste?
   → Campo "ativo" não está sendo salvo
   → Verifique Supabase: coluna "ativo" existe?
```

---

## 🌓 TESTE 6: Testar Modo Escuro/Claro

### Passos:
1. [ ] Certifique-se de estar em http://localhost:3000/dp/configuracao
2. [ ] Verifique modo inicial (claro):
   - [ ] Fundo: branco/cinza claro
   - [ ] Texto: preto/cinza escuro
   - [ ] Botão: "🌙 Escuro"
3. [ ] **Clique no botão** "🌙 Escuro" (topo direito)
4. [ ] Verifique novo modo:
   - [ ] Fundo: azul muito escuro (#0b132b)
   - [ ] Texto: branco/cinza claro
   - [ ] Botão: "☀️ Claro"
   - [ ] Cards: gradiente verde
   - [ ] Acentos: neon verde (#00ff87)
5. [ ] Verifique que **dados continuam os mesmos**
6. [ ] **Clique no botão** "☀️ Claro"
7. [ ] Volte ao modo claro

### Esperado:
```
✅ Tema escuro ativa (fundo escuro, texto claro)
✅ Cores corretas (verde neon em darkMode)
✅ Cards com gradiente em darkMode
✅ Alternar tema não perde dados do formulário
✅ Tema claro volta ao normal
```

### Se falhou:
```
❌ Cores erradas?
   → Verifique cores no código:
   - Claro: #046c3b (verde)
   - Escuro: #00ff87 (neon verde)
   - Fundo escuro: #0b132b
   
❌ Modo escuro não aparece?
   → Verifique useState(false) setDarkMode
   → onClick={() => setDarkMode(!darkMode)}
```

---

## 📊 RESUMO FINAL

| Teste | Status | Observação |
|-------|--------|-----------|
| 1. Tabela Supabase | ✅/❌ | Query executed? |
| 2. Página carrega | ✅/❌ | URL /dp/configuracao? |
| 3. Dias salvam | ✅/❌ | Persistem após recarregar? |
| 4. Horários salvam | ✅/❌ | 08:00-18:30 persiste? |
| 5. Toggle salva | ✅/❌ | Ativo/inativo persiste? |
| 6. Tema funciona | ✅/❌ | Escuro/claro correto? |

---

## ✅ QUANDO TODOS OS TESTES PASSAREM

**Comente:**
```
FASE 2 testada e funcionando. Pronto para FASE 3.
```

**Inclua:**
- ✅ Teste 1: Tabela criada
- ✅ Teste 2: Página carregou
- ✅ Teste 3: Dias salvos e persistem
- ✅ Teste 4: Horários salvos e persistem
- ✅ Teste 5: Toggle salvo e persiste
- ✅ Teste 6: Tema claro/escuro funciona

---

## ❌ SE ALGUM TESTE FALHAR

**Comente detalhes:**
```
Teste X falhou:
- O que tentei fazer?
- Qual erro apareceu?
- Screenshot (se possível)
```

Vamos debugar juntos! 🔧

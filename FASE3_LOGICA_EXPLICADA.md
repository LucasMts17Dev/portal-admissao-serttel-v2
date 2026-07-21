# 📋 FASE 3 - EXPLICAÇÃO DA LÓGICA DE INTEGRAÇÃO COM DP

## 🎯 Objetivo

Quando a IA **APROVAR** um documento, ele não vai direto para "sucesso". Primeiro será consultada a configuração do DP para determinar:
- ✅ O documento vai **direto para DP** (se estiver na janela permitida)
- ⏳ O documento fica **aguardando janela do DP** (se não estiver na janela)

---

## 🔄 FLUXO ATUAL (ANTES DA FASE 3)

```
┌─────────────────┐
│ Auditoria (IA)  │
│ Analisa docs    │
└────────┬────────┘
         │
    ✅ APROVADO?
         │
    ┌────┴────┐
    │          │
   SIM        NÃO
    │          │
    ▼          ▼
 SUCESSO    REJEITADO
    │          │
    └────┬─────┘
         │
    Fim do fluxo
```

**Problema atual:** Quando aprovado, não há verificação da disponibilidade do DP. O documento "desaparece" (em teoria, iria direto para DP, mas DP não tem fila).

---

## 🆕 NOVO FLUXO (FASE 3)

```
┌──────────────────────┐
│ Auditoria (IA)       │
│ Analisa documentos   │
└──────────┬───────────┘
           │
      ✅ APROVADO?
           │
      ┌────┴────┐
      │          │
     SIM        NÃO
      │          │
      ▼          ▼
  CONSULTAR    REJEITADO
   DP CONFIG      │
      │           │
      ▼           │
  ┌─ LOGICA ─┐   │
  │ VERIFICAR │   │
  │ JANELA    │   │
  └────┬─────┘   │
       │          │
  ┌────┴──────┐  │
  │            │  │
DENTRO    FORA    │
JANELA   JANELA   │
  │        │      │
  ▼        ▼      ▼
 ENVIADO  AGUARD REJEIT
  PARA    JANELA  ADO
   DP      DP
```

---

## 🔍 LÓGICA DE VERIFICAÇÃO DA JANELA

### **Fluxo Detalhado:**

```
1️⃣  IA APROVA DOCUMENTO
    └─ Veredito contém: "VEREDITO: APROVADO"

2️⃣  CHAMAR API /api/dp/configuracao (GET)
    └─ Retorna: { dias_mes: [5,15,25], hora_inicio: "08:00", hora_fim: "18:00", ativo: true }

3️⃣  VERIFICAÇÃO #1: DP Ativo?
    ├─ IF config.ativo == false:
    │   └─ Status = "aguardando_janela"
    │   └─ Mensagem = "❌ DP desativado. Entre em contato para liberação."
    │   └─ FIM
    └─ Continua para próxima verificação

4️⃣  VERIFICAÇÃO #2: Dia do Mês Permitido?
    ├─ dia_atual = Date.today().getDate()  // 1-31
    ├─ IF dia_atual NOT IN config.dias_mes:
    │   └─ Status = "aguardando_janela"
    │   └─ Mensagem = "⏳ Fora de prazo de envio. Entre em contato para liberação."
    │   └─ FIM
    └─ Continua para próxima verificação

5️⃣  VERIFICAÇÃO #3: Horário Permitido?
    ├─ hora_atual = Date.now().toTimeString()  // HH:MM
    ├─ IF hora_atual < config.hora_inicio:
    │   └─ Status = "aguardando_janela"
    │   └─ Mensagem = "⏳ Ainda não é horário de recebimento (abre às {hora_inicio})"
    │   └─ FIM
    ├─ IF hora_atual > config.hora_fim:
    │   └─ Status = "aguardando_janela"
    │   └─ Mensagem = "⏳ Horário fechado (reabre amanhã / próximo dia permitido)"
    │   └─ FIM
    └─ Continua para próxima verificação

6️⃣  TODAS AS VERIFICAÇÕES PASSARAM ✅
    ├─ Status = "enviado_dp"
    ├─ Mensagem = "✅ Documento enviado automaticamente para Gestão DP!"
    └─ SUCESSO
```

---

## 💡 EXEMPLOS PRÁTICOS

### **Exemplo 1: DENTRO DA JANELA ✅**

**Configuração DP:**
```json
{
  "ativo": true,
  "dias_mes": [5, 15, 25],
  "hora_inicio": "08:00",
  "hora_fim": "18:00"
}
```

**Cenário:** Hoje é 15/07/2026, 10:30
```
1. IA aprova documento ✅
2. GET /api/dp/configuracao
3. Check 1: ativo = true ✅
4. Check 2: dia 15 IN [5, 15, 25] ✅
5. Check 3: 10:30 > 08:00 E 10:30 < 18:00 ✅

Resultado:
┌────────────────────────────────┐
│ Status: "enviado_dp"           │
│ Mensagem: ✅ Enviado para DP!  │
│ Data: 15/07/2026 10:30        │
└────────────────────────────────┘
```

### **Exemplo 2: FORA DA JANELA (DP desativado) ❌**

**Configuração DP:**
```json
{
  "ativo": false,
  "dias_mes": [5, 15, 25],
  "hora_inicio": "08:00",
  "hora_fim": "18:00"
}
```

**Cenário:** Qualquer data/hora
```
1. IA aprova documento ✅
2. GET /api/dp/configuracao
3. Check 1: ativo = false ❌

Resultado:
┌──────────────────────────────────────┐
│ Status: "aguardando_janela"          │
│ Mensagem: ❌ DP desativado           │
│ Entre em contato para liberação      │
└──────────────────────────────────────┘
```

### **Exemplo 3: FORA DA JANELA (dia não permitido) ❌**

**Configuração DP:**
```json
{
  "ativo": true,
  "dias_mes": [5, 15, 25],
  "hora_inicio": "08:00",
  "hora_fim": "18:00"
}
```

**Cenário:** Hoje é 10/07/2026 (não está em [5,15,25])
```
1. IA aprova documento ✅
2. GET /api/dp/configuracao
3. Check 1: ativo = true ✅
4. Check 2: dia 10 NOT IN [5, 15, 25] ❌

Resultado:
┌──────────────────────────────────────────┐
│ Status: "aguardando_janela"              │
│ Mensagem: ⏳ Fora de prazo de envio      │
│ Entre em contato para liberação.         │
│ Próximas datas: 15/07, 25/07            │
└──────────────────────────────────────────┘
```

### **Exemplo 4: FORA DA JANELA (horário fechado) ❌**

**Configuração DP:**
```json
{
  "ativo": true,
  "dias_mes": [5, 15, 25],
  "hora_inicio": "08:00",
  "hora_fim": "18:00"
}
```

**Cenário:** Hoje é 15/07/2026, 19:30 (fora do horário)
```
1. IA aprova documento ✅
2. GET /api/dp/configuracao
3. Check 1: ativo = true ✅
4. Check 2: dia 15 IN [5, 15, 25] ✅
5. Check 3: 19:30 > 18:00 ❌

Resultado:
┌──────────────────────────────────────────┐
│ Status: "aguardando_janela"              │
│ Mensagem: ⏳ Horário fechado (18:00)     │
│ Reabre amanhã: 16/07 às 08:00            │
│ Ou próximo dia permitido: 25/07 08:00   │
└──────────────────────────────────────────┘
```

---

## 🛠️ PONTOS DE INTEGRAÇÃO NO CÓDIGO

### **Onde será feita a mudança:**

**Arquivo:** `app/auditoria/page.tsx`

**Função:** Dentro de `handleAuditoria()` (já existe)

**Localização do código:**
```typescript
// Após IA retornar resposta com "VEREDITO: APROVADO"
if (respostaIA.includes('VEREDITO: APROVADO')) {
  
  // 🆕 NOVA LÓGICA: Verificar janela do DP
  const verificarJanelaDP = async () => {
    const config = await fetch('/api/dp/configuracao').then(r => r.json());
    
    // Aplicar lógica de verificação (6 passos acima)
    
    // Se passou em todas verificações:
    setStatus('sucesso');  // Ou novo status: 'enviado_dp'
    
    // Se falhou em alguma:
    setStatus('aguardando_janela');  // Novo status
  };
  
  await verificarJanelaDP();
}
```

---

## 📊 NOVOS STATUS NECESSÁRIOS

**Status Atuais:**
```typescript
type StatusValidacao = 'aguardando' | 'processando' | 'sucesso' | 'erro';
```

**Status Novos Necessários:**
```typescript
type StatusValidacao = 
  | 'aguardando'           // Inicial, aguardando análise
  | 'processando'          // IA analisando
  | 'sucesso'              // ✅ APROVADO e ENVIADO PARA DP (antes chamava assim)
  | 'erro'                 // ❌ Erro no sistema
  | 'aguardando_janela'    // ⏳ NOVO: Aprovado mas fora da janela do DP
  | 'rejeitado'            // ❌ NOVO: Rejeitado pela IA (opcional, refinamento)
  | 'enviado_dp';          // ✅ NOVO: Enviado com sucesso para DP
```

---

## 📝 RESPOSTA DA IA (MODIFICAÇÃO)

**Antes (atual):**
```
VEREDITO: APROVADO
✅ Todos os documentos foram validados com sucesso!
O candidato está qualificado para admissão.
```

**Depois (fase 3):**
```
VEREDITO: APROVADO
✅ Todos os documentos foram validados com sucesso!

Consultando disponibilidade do DP...
✅ Enviado automaticamente para Gestão DP!
(Data: 15/07/2026 10:30)
```

**Se fora da janela:**
```
VEREDITO: APROVADO
✅ Todos os documentos foram validados com sucesso!

Consultando disponibilidade do DP...
⏳ Fora de prazo de envio. Entre em contato para liberação.
Próximas datas de recebimento: 15/07, 25/07
```

---

## 🔗 FLUXO COM DADOS REAIS

```
Usuário clica "Analisar e Aprovar"
    ↓
handleAuditoria() inicia
    ↓
Envia docs para IA (Gemini)
    ↓
IA retorna: "VEREDITO: APROVADO"
    ↓
respostaIA.includes('VEREDITO: APROVADO') → TRUE
    ↓
🆕 fetch('/api/dp/configuracao')
    ↓
Recebe: { ativo: true, dias_mes: [5,15,25], hora_inicio: "08:00", hora_fim: "18:00" }
    ↓
Verifica 6 passos (acima)
    ↓
┌─ RESULTADO ─┐
│             │
DENTRO    FORA
JANELA    JANELA
│             │
status:    status:
"enviado_dp"  "aguardando_janela"
│             │
✅            ⏳
```

---

## 📌 RESUMO DA LÓGICA

| Passo | Verificação | Condition | Se Falhar | Se Passar |
|-------|------------|-----------|-----------|-----------|
| 1 | DP Ativo | `config.ativo == true` | aguardando_janela | Próxima |
| 2 | Dia Permitido | `dia_atual IN config.dias_mes` | aguardando_janela | Próxima |
| 3 | Antes Início | `hora_atual >= config.hora_inicio` | aguardando_janela | Próxima |
| 4 | Antes Final | `hora_atual <= config.hora_fim` | aguardando_janela | ✅ ENVIADO |

---

## 🎯 IMPACTO NO USUÁRIO

### **Cenário 1: Dentro da Janela**
```
Gestor vê: ✅ "Documento enviado automaticamente para Gestão DP!"
DP vê: 📁 Novo documento chega em "Gestão de Documentos"
```

### **Cenário 2: Fora da Janela**
```
Gestor vê: ⏳ "Documento aprovado mas aguardando janela do DP"
           "Próximas datas: 15/07, 25/07 entre 08:00-18:00"
DP vê: 🚫 Nada (ainda não llegou)
```

---

## ✅ PRÓXIMAS AÇÕES

1. ✅ Explicação acima (entendimento)
2. ⏳ Aguardando confirmação do usuário
3. 📝 Implementar a lógica na auditoria
4. 🧪 Testar com diferentes cenários

---

## ❓ DÚVIDAS SOBRE A LÓGICA?

Antes de implementar, você tem alguma dúvida ou quer ajustar algo?

Exemplos de mudanças possíveis:
- "E se recusarmos envios no fim de semana?"
- "E se houver feriados?"
- "Precisa gravar log de quando foi enviado?"
- "Quer notificação em tempo real para o DP?"


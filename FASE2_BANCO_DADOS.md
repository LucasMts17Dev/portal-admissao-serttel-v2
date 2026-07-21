# 📊 FASE 2 REVISADA - ESTRUTURA DA TABELA `dp_configuracao`

## ✅ ANTES DE EXECUTAR SQL - VERIFIQUE ESTA ESTRUTURA

### Tabela: `dp_configuracao`

```sql
-- Criar tabela de configuração do DP
CREATE TABLE dp_configuracao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dias do mês para recebimento (array de inteiros 1-31)
  dias_mes INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  
  -- Horários de funcionamento (formato HH:MM)
  hora_inicio VARCHAR(5) DEFAULT '09:00',
  hora_fim VARCHAR(5) DEFAULT '17:00',
  
  -- Status de ativação geral
  ativo BOOLEAN DEFAULT true,
  
  -- Auditoria
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📋 DESCRIÇÃO DOS CAMPOS

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `id` | UUID | gen_random_uuid() | Identificador único |
| `dias_mes` | INTEGER[] | [] | Array de dias do mês (1-31) quando recebe documentos |
| `hora_inicio` | VARCHAR(5) | '09:00' | Horário inicial (HH:MM) |
| `hora_fim` | VARCHAR(5) | '17:00' | Horário final (HH:MM) |
| `ativo` | BOOLEAN | true | Recebimento ativo? |
| `criado_em` | TIMESTAMP | NOW() | Data de criação |
| `atualizado_em` | TIMESTAMP | NOW() | Data da última atualização |

---

## 🎯 EXEMPLO DE DADOS

### Configuração: DP recebe nos dias 5, 15 e 25, das 08:00 às 18:00
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "dias_mes": [5, 15, 25],
  "hora_inicio": "08:00",
  "hora_fim": "18:00",
  "ativo": true,
  "criado_em": "2026-07-09T15:00:00Z",
  "atualizado_em": "2026-07-09T15:00:00Z"
}
```

### Configuração: DP desativado
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "dias_mes": [],
  "hora_inicio": "09:00",
  "hora_fim": "17:00",
  "ativo": false,
  "criado_em": "2026-07-09T15:00:00Z",
  "atualizado_em": "2026-07-09T15:00:00Z"
}
```

---

## 🔄 LÓGICA DE VALIDAÇÃO NA FASE 3

Quando IA aprovar um documento, será consultado:

```pseudocode
GET /api/dp/configuracao
config = response.data

// 1. Verificar se recebimento está ativo
IF config.ativo == false:
  status = "aguardando_janela"
  mensagem = "Recebimento desativado. Entre em contato."
  STOP

// 2. Verificar dia do mês
dia_hoje = current_date().day  // 1-31
IF dia_hoje NOT IN config.dias_mes:
  status = "aguardando_janela"
  mensagem = "Fora de prazo de envio. Entre em contato para liberação."
  STOP

// 3. Verificar horário
agora = current_time()
IF agora < config.hora_inicio OR agora > config.hora_fim:
  status = "aguardando_janela"
  mensagem = "Fora de prazo de envio. Entre em contato para liberação."
  STOP

// 4. Dentro da janela!
enviar_para_dp()
status = "enviado_dp"
```

---

## ✨ BENEFÍCIOS DA NOVA ESTRUTURA

✅ **Flexibilidade Total**
- DP escolhe exatamente quais dias quer receber
- Suporta qualquer combinação de dias
- Array nativo do PostgreSQL

✅ **Simples e Eficiente**
- Uma única coluna para os dias (em vez de 7 booleanos)
- Fácil de atualizar
- Sem redundância

✅ **Escalável**
- Pronto para múltiplas configurações (por filial, por departamento)
- Suporta feriados futuros
- JSON serialization automática

✅ **Auditável**
- `criado_em` e `atualizado_em` rastreiam mudanças
- Histórico de quem fez o quê

---

## 📋 MUDANÇAS EM RELAÇÃO À VERSÃO ANTERIOR

| Aspecto | Antes | Depois |
|--------|-------|--------|
| Dias | 7 colunas booleanas (seg-dom) | 1 coluna array (dias 1-31) |
| Flexibilidade | Apenas padrões semanais | Dias específicos do mês |
| UI | 7 checkboxes | Calendário com 31 dias |
| Exemplo | segunda-sexta ativo | 5, 15, 25 ativo |

---

## 📝 PRÓXIMOS PASSOS

1. **Criar tabela** (SQL acima)
2. **Acessar página** `http://localhost:3000/dp/configuracao`
3. **Selecionar dias** do mês (1-31)
4. **Configurar horários**
5. **Salvar** configuração
6. **Testar** com dados persistidos

---

## ❓ DÚVIDAS?

Se precisar alterar a estrutura, avise ANTES de criar a tabela.

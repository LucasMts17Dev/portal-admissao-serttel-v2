-- ════════════════════════════════════════════════════════════════════════════════
-- FASE 2 REVISADA - CRIAR TABELA dp_configuracao NO SUPABASE
-- ════════════════════════════════════════════════════════════════════════════════

-- Cole este SQL no Supabase > SQL Editor e clique em "Run"

CREATE TABLE IF NOT EXISTS dp_configuracao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ─── Dias do mês para recebimento (array de inteiros 1-31) ─────────────────
  dias_mes INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  
  -- ─── Horários de funcionamento (formato HH:MM) ────────────────────────────
  hora_inicio VARCHAR(5) DEFAULT '09:00',
  hora_fim VARCHAR(5) DEFAULT '17:00',
  
  -- ─── Status de ativação geral ──────────────────────────────────────────────
  ativo BOOLEAN DEFAULT true,
  
  -- ─── Auditoria ────────────────────────────────────────────────────────────
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════════════════════
-- RESULTADO ESPERADO: "Query executed successfully" (verde)
-- ════════════════════════════════════════════════════════════════════════════════

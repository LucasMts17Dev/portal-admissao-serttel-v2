# 🎯 ANÁLISE COMPLETA DA ARQUITETURA

## 📋 Resumo Executivo

Depois de analisar **TODA** a estrutura do projeto, identifiquei os padrões exatos. Este documento garante que qualquer nova implementação seguirá **100% o padrão existente**.

---

## 🏗️ ARQUITETURA DO PROJETO

### **Estrutura de Pastas Atual**
```
app/
├── page.tsx                          ← Home (3 cards)
├── layout.tsx                        ← Root layout (simples)
├── globals.css                       ← Estilos globais
│
├── login/page.tsx                    ← Tela de login
├── admissao/page.tsx                 ← Formulário candidato (54KB)
├── auditoria/page.tsx                ← Dashboard gestor
├── dp/                               ← [NOVA PASTA]
│   ├── page.tsx                      ← Dashboard DP
│   ├── configuracao/page.tsx         ← [NOVA] Config DP
│   ├── gestao/page.tsx               ← [NOVA] Listar documentos
│   └── auditorias/[id]/page.tsx      ← [NOVA] Visualizar documento
│
├── components/
│   └── BackButton.tsx                ← Único componente externo
│
├── api/
│   ├── auth/[...nextauth]/route.ts   ← NextAuth
│   ├── gestores/route.ts             ← Criar gestor
│   ├── auditoria/route.ts            ← Análise Gemini
│   ├── dp/                           ← [NOVA PASTA]
│   │   ├── route.ts                  ← [NOVA] Info DP
│   │   ├── configuracao/route.ts     ← [NOVA] Config
│   │   └── auditorias/route.ts       ← [NOVA] Listar/Confirmar
│   └── auditoria/
│       └── aprovar/route.ts          ← [NOVA] Salvar com status
│
└── middleware.ts                      ← Proteção de rotas
```

---

## 🎨 PADRÕES DE ESTILO

### **Paleta de Cores**
```
Verde Serttel Claro:  #046c3b
Verde Serttel Neon:   #00ff87
Fundo Escuro:         #0b132b
Fundo Card Escuro:    #111c44/60
Input/Card Escuro:    #0f172a/60
Cinza Claro:          #f1f5f9 (bg-slate-50)
Cinza Escuro:         #1e293b (bg-slate-800)
```

### **Componentes Reutilizáveis (INLINE)**
Todos os componentes são definidos **dentro** do arquivo .tsx, nunca em arquivo separado.

#### 1. **Card Component**
```typescript
interface CardProps {
  children: React.ReactNode;
  dark: boolean;
  className?: string;
}

function Card({ children, dark, className = '' }: CardProps) {
  return (
    <div className={`rounded-3xl p-6 shadow-2xl relative border transition-all duration-300 ${
      dark
        ? 'bg-[#111c44]/60 border-slate-800/80 backdrop-blur-xl'
        : 'bg-white border-slate-200'
    } ${className}`}>
      {dark && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#046c3b] via-[#00ff87] to-transparent rounded-t-3xl" />
      )}
      {children}
    </div>
  );
}
```

#### 2. **ToggleBotao Component**
```typescript
interface ToggleBotaoProps {
  label: string;
  valor: boolean | null;
  onChange: (v: boolean) => void;
  dark: boolean;
}

function ToggleBotao({ label, valor, onChange, dark }: ToggleBotaoProps) {
  const baseInativo = dark
    ? 'bg-[#0f172a] text-slate-400 border-slate-800'
    : 'bg-white text-slate-500 border-slate-200';

  return (
    <div className={`p-4 border rounded-2xl flex flex-col justify-between space-y-3 ${
      dark ? 'bg-[#1c2754]/40 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      <span className={dark ? 'text-slate-300 text-xs font-bold' : 'text-slate-600 text-xs font-bold'}>
        {label}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 py-2 rounded-xl font-black text-xs border transition-all ${
            valor === true
              ? 'bg-[#046c3b] text-white border-[#00ff87] shadow-[0_0_10px_rgba(0,255,135,0.2)]'
              : baseInativo
          }`}
        >
          Sim
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 py-2 rounded-xl font-black text-xs border transition-all ${
            valor === false
              ? 'bg-red-950/80 text-red-400 border-red-500/50'
              : baseInativo
          }`}
        >
          Não
        </button>
      </div>
    </div>
  );
}
```

#### 3. **InputArquivo Component**
```typescript
interface InputArquivoProps {
  label: string;
  campo: CampoArquivo;
  arquivo: File | null;
  onChange: (campo: CampoArquivo, file: File | null) => void;
  dark: boolean;
  disabled?: boolean;
  accept?: string;
  className?: string;
}

function InputArquivo({
  label, campo, arquivo, onChange, dark, 
  disabled = false, accept = 'application/pdf,image/*', 
  className = ''
}: InputArquivoProps) {
  const fundoPadrao = dark 
    ? 'bg-[#0f172a]/60 border-slate-800 text-slate-400' 
    : 'bg-white border-slate-200 text-slate-600';
  const fundoDesabilitado = 'bg-slate-950/20 border-slate-900/50 opacity-30 pointer-events-none';

  return (
    <div className={`flex flex-col gap-2 p-4 border rounded-xl transition-all ${
      disabled ? fundoDesabilitado : fundoPadrao
    } ${className}`}>
      <label className="text-[11px] font-black uppercase text-slate-400">
        {label}
      </label>
      {disabled ? (
        <span className="text-[11px] text-slate-600 italic">— não aplicável —</span>
      ) : (
        <>
          <input
            type="file"
            accept={accept}
            onChange={(e) => onChange(campo, e.target.files?.[0] ?? null)}
            className="text-xs cursor-pointer"
          />
          {arquivo && (
            <span className="text-[10px] text-green-400 font-bold mt-1 block truncate">
              ✓ {arquivo.name}
            </span>
          )}
        </>
      )}
    </div>
  );
}
```

#### 4. **BackButton Component (Externo)**
```typescript
// components/BackButton.tsx
'use client';
import Link from "next/link";

export default function BackButton() {
  return (
    <Link
      href="/"
      className="fixed top-5 left-5 z-50 inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#00ff87] transition-colors print:hidden"
    >
      ← Voltar ao início
    </Link>
  );
}
```

---

## 📐 Padrão de Layout (Por Página)

### **Template Padrão com Header Sticky**
```typescript
'use client';
import { useState } from 'react';
import BackButton from '../components/BackButton';

export default function MeuPage() {
  const [darkMode, setDarkMode] = useState(false);
  const verde = darkMode ? 'text-[#00ff87]' : 'text-[#046c3b]';

  return (
    <div className={`min-h-screen font-sans relative overflow-x-hidden transition-colors duration-300 ${
      darkMode 
        ? 'bg-[#0b132b] text-slate-100 selection:bg-[#00ff87]/20 selection:text-[#00ff87]'
        : 'bg-slate-50 text-slate-800'
    }`}>
      <BackButton />

      {/* Glows Decorativos (Dark Mode Only) */}
      {darkMode && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#046c3b]/10 blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#00ff87]/5 blur-[150px] pointer-events-none animate-pulse" />
        </>
      )}

      {/* Header Sticky */}
      <nav className={`px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 ${
        darkMode
          ? 'bg-[#0b132b]/80 border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl ${
            darkMode
              ? 'bg-gradient-to-tr from-[#046c3b] to-[#00ff87] text-white shadow-[0_0_15px_rgba(0,255,135,0.4)]'
              : 'bg-[#046c3b] text-white'
          }`}>
            S
          </div>
          <div>
            <span className={`text-[10px] font-black tracking-widest block uppercase ${verde}`}>
              Serttel · [Área]
            </span>
            <span className={`text-lg font-black tracking-tight ${
              darkMode
                ? 'bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent'
                : 'text-[#046c3b]'
            }`}>
              [Título]
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
              darkMode
                ? 'bg-[#111c44]/60 border-slate-700 text-[#00ff87] hover:border-[#00ff87]'
                : 'bg-slate-100 border-slate-300 text-[#046c3b] hover:bg-slate-200'
            }`}
          >
            {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
          </button>
          
          <div className={`text-xs font-black tracking-widest px-4 py-2 rounded-xl border uppercase ${
            darkMode
              ? 'text-[#00ff87] bg-[#046c3b]/20 border-[#00ff87]/30'
              : 'text-[#046c3b] bg-green-50 border-green-200'
          }`}>
            Status Info
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto my-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-8">
          <Card dark={darkMode}>
            {/* Conteúdo */}
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card dark={darkMode}>
            {/* Sidebar */}
          </Card>
        </div>
      </main>
    </div>
  );
}
```

---

## 🔐 Padrão de Autenticação

### **NextAuth Configuration**
- Provider: **Credentials** (email + senha)
- Strategy: **JWT** (8 horas)
- Database: **Supabase** (tabela `usuarios`)
- Roles: `'admin'` (DP), `'gestor'`

### **Middleware Protection**
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const sessionToken = 
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value;

  const isLoginPage = req.nextUrl.pathname === '/login';

  if (!sessionToken && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (sessionToken && isLoginPage) {
    return NextResponse.redirect(new URL('/auditoria', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auditoria/:path*', '/login'],
};
```

---

## 📡 Padrão de APIs

### **Template de API Protegida**
```typescript
// app/api/[modulo]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // 1. Validar sessão
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ erro: 'Acesso negado.' }, { status: 403 });
  }

  // 2. Validar role se necessário
  if ((session.user as any)?.role !== 'admin') {
    return NextResponse.json({ erro: 'Acesso restrito a admin.' }, { status: 403 });
  }

  // 3. Parse request body
  const body = await req.json();
  
  // 4. Processar dados
  try {
    // Lógica aqui
    
    return NextResponse.json({ ok: true, data: {} });
  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json(
      { erro: error.message || 'Erro ao processar' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ erro: 'Acesso negado.' }, { status: 403 });
  }

  try {
    // Lógica GET
    return NextResponse.json({ ok: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}
```

---

## 🎯 Inputs & Formulários

### **Padrão de Input Text**
```typescript
<div className="flex flex-col gap-1.5">
  <label className="text-[11px] font-bold text-slate-400 uppercase">
    Nome *
  </label>
  <input
    type="text"
    value={nome}
    onChange={(e) => setNome(e.target.value)}
    placeholder="Digite aqui..."
    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${
      darkMode
        ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]'
        : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'
    }`}
  />
</div>
```

### **Padrão de Select**
```typescript
<div className="flex flex-col gap-1.5">
  <label className="text-[11px] font-bold text-slate-400 uppercase">
    Opção *
  </label>
  <select
    value={opcao}
    onChange={(e) => setOpcao(e.target.value)}
    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${
      darkMode
        ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]'
        : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'
    }`}
  >
    <option value="">Selecione...</option>
    <option value="op1">Opção 1</option>
  </select>
</div>
```

### **Padrão de Botão**
```typescript
<button
  type="button"
  onClick={handleClick}
  disabled={carregando}
  className={`w-full text-white font-black text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 hover:brightness-110 active:scale-[0.985] ${
    darkMode
      ? 'bg-gradient-to-r from-[#046c3b] to-[#00ff87] shadow-[0_0_20px_rgba(0,255,135,0.25)]'
      : 'bg-[#046c3b]'
  }`}
>
  {carregando ? (
    <span className="flex items-center justify-center gap-2">
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Processando…
    </span>
  ) : '🔍 Ação'}
</button>
```

---

## 📊 Padrão de Dados

### **Estrutura Supabase - Tabela `usuarios`**
```sql
id               UUID PRIMARY KEY
nome             TEXT
email            TEXT UNIQUE
senha_hash       TEXT
filial           TEXT
role             TEXT ('admin' | 'gestor')
ativo            BOOLEAN DEFAULT true
criado_por       TEXT
created_at       TIMESTAMP DEFAULT NOW()
updated_at       TIMESTAMP DEFAULT NOW()
```

### **[NOVA] Tabela `dp_configuracao`** (Fase 2)
```sql
id               UUID PRIMARY KEY
segunda          BOOLEAN DEFAULT false
terca            BOOLEAN DEFAULT false
quarta           BOOLEAN DEFAULT false
quinta           BOOLEAN DEFAULT false
sexta            BOOLEAN DEFAULT false
sabado           BOOLEAN DEFAULT false
domingo          BOOLEAN DEFAULT false
hora_inicio      TIME DEFAULT '08:00'
hora_fim         TIME DEFAULT '17:00'
ativo            BOOLEAN DEFAULT false
atualizado_em    TIMESTAMP DEFAULT NOW()
```

### **[NOVA] Tabela `auditorias`** (Fase 3)
```sql
id               UUID PRIMARY KEY
candidato_nome   TEXT
gestor_email     TEXT
status           TEXT ('aguardando', 'aprovado', 'enviado_dp', 'aguardando_janela', 'confirmado_dp')
veredito         TEXT
data_aprovacao   TIMESTAMP
data_envio_dp    TIMESTAMP
arquivos         JSONB
created_at       TIMESTAMP DEFAULT NOW()
```

---

## ✅ CHECKLIST DE QUALIDADE

Ao implementar qualquer arquivo novo, garantir:

- [ ] `'use client'` no topo (para componentes interativos)
- [ ] `import { useState } from 'react'`
- [ ] `const [darkMode, setDarkMode] = useState(false);` (padrão false=claro)
- [ ] Header sticky com navbar ou BackButton
- [ ] Botão tema top-right com ☀️/🌙
- [ ] Glows decorativos apenas em dark mode
- [ ] Variável `verde` condicional na renderização
- [ ] Inputs com estilos dinâmicos claro/escuro
- [ ] Botões com gradiente ou cores de status
- [ ] Cards com componente `Card` quando apropriado
- [ ] Grid responsivo: `grid-cols-1 lg:grid-cols-...`
- [ ] BackButton em rota protegida
- [ ] Validação de session em APIs
- [ ] Respostas de API com `NextResponse.json()`
- [ ] Nomes descritivos e semânticos
- [ ] Comentários apenas onde necessário

---

## 🚀 PRÓXIMAS IMPLEMENTAÇÕES

**Seguir este documento ao criar:**
1. `/dp/page.tsx` - Dashboard
2. `/dp/configuracao/page.tsx` - Tela config
3. `/api/dp/configuracao/route.ts` - API config
4. Alterações em `/auditoria/page.tsx`
5. Novas tabelas Supabase
6. `/dp/gestao/page.tsx` - Listagem
7. `/api/dp/auditorias/route.ts` - API listagem

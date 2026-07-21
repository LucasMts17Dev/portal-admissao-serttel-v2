# 📋 PLANO DE IMPLEMENTAÇÃO - GESTÃO DP

## 🏗️ ARQUITETURA IDENTIFICADA

### **Padrões de Estilo (Tailwind)**
```
Cores Base:
- Verde principal: #046c3b
- Verde neon: #00ff87
- Fundo escuro: #0b132b
- Fundo card claro: bg-white
- Fundo card escuro: bg-[#111c44]/60

Estilos Recorrentes:
- Cards: rounded-3xl p-6 shadow-2xl border transition-all
- Inputs: rounded-xl px-4 py-3 border outline-none transition-colors
- Botões: rounded-xl font-black py-3-4 transition-all cursor-pointer
- Headers: sticky top-0 z-50 backdrop-blur-md
- Gradientes: from-[#046c3b] to-[#00ff87], shadows com rgba
```

### **Estrutura de Componentes**
```
✅ Componentes INTERNOS (inline no arquivo tsx):
  - Card({ children, dark, className })
  - ToggleBotao({ label, valor, onChange, dark })
  - InputArquivo({ label, campo, arquivo, onChange, dark, ... })
  - BackButton (componente externo reutilizável)

❌ Sem componentes em arquivos .tsx separados
❌ Sem pasta /components/shared ou /lib
```

### **Padrão de Autenticação**
```
- NextAuth v4 com CredentialsProvider
- JWT strategy, 8 horas de sessão
- Supabase para dados
- Tabela: usuarios (id, nome, email, senha_hash, filial, role, ativo)
- Roles: 'admin' (DP), 'gestor'
- Middleware: Valida token, redireciona /login se ausente
```

### **Padrão de APIs**
```
- POST requests, NextRequest/NextResponse
- JSON body parsing
- Session validation via getServerSession()
- Sem cache, sem persistência em arquivo
- Respostas: { ok: true, data } ou { erro, status }
```

### **Padrão de Temas**
```
- Component-level: useState(darkMode)
- Condicional ternário inline: darkMode ? 'dark-class' : 'light-class'
- Botão tema em top-right: "☀️ Modo Claro" / "🌙 Modo Escuro"
- Glows decorativos: apenas em dark mode (animate-pulse)
```

### **Estrutura de Layouts**
```
- Layout raiz: app/layout.tsx (simples, sem providers)
- Cada rota tem sua página full-page (app/[rota]/page.tsx)
- No main: max-w-4xl ou max-w-7xl mx-auto px-4
- Grid responsivo: grid-cols-1 lg:grid-cols-3 gap-8
- Header sticky com navbar
- BackButton em top-left
```

---

## 📂 ARQUIVOS A CRIAR/ALTERAR

### **FASE 1: Estrutura Base do DP**

#### ✅ Arquivos a ALTERAR:
1. **`app/page.tsx`** (Home)
   - Adicionar 3º card "Sou DP" → href="/dp"
   - Mesmo padrão dos cards existentes

2. **`middleware.ts`**
   - Adicionar matcher: `/dp/:path*`
   - Validação de token (já existe)

#### ✅ Arquivos a CRIAR:
3. **`app/dp/page.tsx`** (Dashboard DP)
   - Reutilizar: layout, header sticky, backbutton, tema, cores
   - Conteúdo: Placeholder para futuras abas
   - Structure:
     ```
     <div>
       <header> {/* Copy do header de auditoria */}
         Logo + Tema + Info
       </header>
       <main>
         <Card>
           Bem-vindo ao DP
         </Card>
       </main>
     </div>
     ```

#### ✅ Arquivos a CRIAR:
4. **`app/api/dp/route.ts`** (API placeholder)
   - GET: Informações do DP (futuro)
   - POST: Configuração do DP (futuro)

---

### **FASE 2: Configuração do DP**

#### ✅ Arquivos a CRIAR:
5. **`app/dp/configuracao/page.tsx`** (Tela de configuração)
   - Estados: diasSemana, horarioInicial, horarioFinal, ativar
   - Componentes: ToggleBotao reutilizado, inputs time
   - Padrão: Card + Grid + Inputs
   - Botão: "Salvar Configuração" (POST /api/dp/configuracao)

#### ✅ Tabela Supabase:
6. **`dp_configuracao`** (Supabase)
   ```
   id uuid (PK)
   segunda boolean (default: false)
   terca boolean
   quarta boolean
   quinta boolean
   sexta boolean
   sabado boolean
   domingo boolean
   hora_inicio time (ex: 08:00)
   hora_fim time (ex: 17:00)
   ativo boolean (default: false)
   atualizado_em timestamp
   ```

#### ✅ Arquivo a CRIAR:
7. **`app/api/dp/configuracao/route.ts`** (API)
   - GET: Retorna configuração do DP
   - POST: Atualiza configuração (apenas admin/DP)

---

### **FASE 3: Modificação da Auditoria**

#### ✅ Arquivo a ALTERAR:
8. **`app/auditoria/page.tsx`**
   - Depois de "VEREDITO: APROVADO":
     - Chamar: `GET /api/dp/configuracao`
     - Verificar: dia semana + horário atual
     - Se OK: `POST /api/auditoria/aprovar` → salva com status="enviado_dp"
     - Se NÃO: status="aguardando_janela" + mensagem "Fora de prazo..."

#### ✅ Tabela Supabase:
9. **`auditorias`** (Nova, ou alterar se existir)
   ```
   id uuid
   candidato_nome text
   gestor_email text
   status text (aguardando, aprovado, enviado_dp, aguardando_janela, confirmado_dp)
   veredito text
   data_aprovacao timestamp
   data_envio_dp timestamp
   arquivos jsonb (lista de files)
   ```

#### ✅ Arquivo a CRIAR:
10. **`app/api/auditoria/aprovar/route.ts`** (API)
    - POST: Salva auditoria com status baseado na config DP

---

### **FASE 4: Gestão DP (Listar e Confirmar)**

#### ✅ Arquivo a CRIAR:
11. **`app/dp/gestao/page.tsx`** (Listar documentos)
    - Tabela/Cards com:
      - Nome candidato
      - Data aprovação
      - Gestor responsável
      - Status (badge colorido)
      - Botões: "Visualizar" + "Confirmar recebimento"
    - GET `/api/dp/auditorias` para carregar dados
    - PUT `/api/dp/auditorias/:id` para confirmar

#### ✅ Arquivo a CRIAR:
12. **`app/dp/auditorias/[id]/page.tsx`** (Visualizar documentos)
    - Modal ou página: Mostra PDFs/imagens dos arquivos
    - Mesmo padrão do upload em auditoria

#### ✅ Arquivo a CRIAR:
13. **`app/api/dp/auditorias/route.ts`** (API)
    - GET: Lista auditorias com status "enviado_dp"
    - PUT/:id: Atualiza status para "confirmado_dp"

---

## 🎨 COMPONENTES A REUTILIZAR

```typescript
// De auditoria/page.tsx:
function Card({ children, dark, className = '' }: CardProps)
function ToggleBotao({ label, valor, onChange, dark }: ToggleBotaoProps)

// De components/BackButton.tsx:
function BackButton()

// Estilos recorrentes:
- Header sticky: px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-50
- Verde variável: const verde = darkMode ? 'text-[#00ff87]' : 'text-[#046c3b]';
- Inputs: w-full border rounded-xl px-4 py-3 outline-none transition-colors
- Botões: w-full text-white font-black py-3 rounded-xl transition-all cursor-pointer hover:brightness-110 active:scale-[0.985]
```

---

## 📝 RESUMO DE IMPLEMENTAÇÃO

| Fase | Arquivos | Status | Dependências |
|------|----------|--------|---|
| 1 | page.tsx, middleware.ts, /dp/page.tsx, /api/dp/route.ts | ⬜ Nova | Nenhuma |
| 2 | /dp/configuracao/page.tsx, /api/dp/configuracao/route.ts, DB | ⬜ Nova | Fase 1 OK |
| 3 | /auditoria/page.tsx (ALT), /api/auditoria/aprovar/route.ts, DB | ⬜ Alteração | Fase 2 OK |
| 4 | /dp/gestao/page.tsx, /dp/auditorias/[id]/page.tsx, /api/dp/auditorias/route.ts | ⬜ Nova | Fase 3 OK |

---

## ✅ CHECKLIST DE PADRÕES

Ao implementar cada arquivo, garantir:

- [ ] `'use client'` no topo (client component)
- [ ] `import { useState } from 'react'`
- [ ] `const [darkMode, setDarkMode] = useState(false);`
- [ ] Header sticky com navbar (ou BackButton para telas simples)
- [ ] Botão tema em top-right (quando houver header)
- [ ] Glows decorativos (apenas dark mode)
- [ ] Variável `verde` condicional
- [ ] Inputs/selects com estilos dinâmicos
- [ ] Botões com gradiente green ou status colors
- [ ] Cards com `Card` component (quando houver conteúdo)
- [ ] Grid responsivo: `grid-cols-1 lg:grid-cols-...`
- [ ] BackButton em rota protegida (top-left)
- [ ] `NextResponse.json()` em APIs
- [ ] Validação de `session` em APIs protegidas
- [ ] Nomes descritivos de variáveis de estado

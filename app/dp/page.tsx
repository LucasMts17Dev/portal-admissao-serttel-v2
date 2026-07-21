'use client';

import { useState } from 'react';
import BackButton from '../components/BackButton';

// ─── Sub-componentes ──────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  dark: boolean;
  className?: string;
}

function Card({ children, dark, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-3xl p-6 shadow-2xl relative border transition-all duration-300 ${
        dark
          ? 'bg-[#111c44]/60 border-slate-800/80 backdrop-blur-xl'
          : 'bg-white border-slate-200'
      } ${className}`}
    >
      {dark && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#046c3b] via-[#00ff87] to-transparent rounded-t-3xl" />
      )}
      {children}
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function DPPage() {
  const [darkMode, setDarkMode] = useState(false);
  const verde = darkMode ? 'text-[#00ff87]' : 'text-[#046c3b]';

  return (
    <div
      className={`min-h-screen font-sans relative overflow-x-hidden transition-colors duration-300 ${
        darkMode
          ? 'bg-[#0b132b] text-slate-100 selection:bg-[#00ff87]/20 selection:text-[#00ff87]'
          : 'bg-slate-50 text-slate-800'
      }`}
    >
      <BackButton />

      {/* Glows de Fundo Futuristas (Apenas modo escuro) */}
      {darkMode && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#046c3b]/10 blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#00ff87]/5 blur-[150px] pointer-events-none animate-pulse" />
        </>
      )}

      {/* Header Sticky */}
      <nav
        className={`px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 ${
          darkMode
            ? 'bg-[#0b132b]/80 border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl ${
              darkMode
                ? 'bg-gradient-to-tr from-[#046c3b] to-[#00ff87] text-white shadow-[0_0_15px_rgba(0,255,135,0.4)]'
                : 'bg-[#046c3b] text-white'
            }`}
          >
            S
          </div>
          <div>
            <span className={`text-[10px] font-black tracking-widest block uppercase ${verde}`}>
              Serttel · Gestão DP
            </span>
            <span
              className={`text-lg font-black tracking-tight ${
                darkMode
                  ? 'bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent'
                  : 'text-[#046c3b]'
              }`}
            >
              Documentação Pessoal
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

          <div
            className={`text-xs font-black tracking-widest px-4 py-2 rounded-xl border uppercase hidden sm:block ${
              darkMode
                ? 'text-[#00ff87] bg-[#046c3b]/20 border-[#00ff87]/30'
                : 'text-[#046c3b] bg-green-50 border-green-200'
            }`}
          >
            Admin Ativo
          </div>
        </div>
      </nav>

      {/* Layout principal */}
      <main className="max-w-7xl w-full mx-auto my-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Bem-vindo */}
          <Card dark={darkMode}>
            <div className="mb-6">
              <h2
                className={`text-lg font-black tracking-tight flex items-center gap-2 ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}
              >
                <span className={verde}>👋</span> Bem-vindo ao Painel DP
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Gestão centralizada de documentação pessoal e configurações de recebimento.
              </p>
            </div>

            <div
              className={`p-4 border rounded-2xl space-y-3 ${
                darkMode
                  ? 'bg-[#0a2f1d]/40 border-[#00ff87]/20'
                  : 'bg-green-50/50 border-green-200'
              }`}
            >
              <span className={`block text-xs font-bold ${verde}`}>
                ℹ️ Informações do Sistema
              </span>
              <span className="text-[11px] text-slate-400 block leading-relaxed">
                Use o painel a seguir para configurar os horários de funcionamento do DP e gerenciar
                documentos enviados automaticamente pelos gestores após aprovação.
              </span>
            </div>
          </Card>

          {/* Estatísticas Placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card dark={darkMode}>
              <div className="text-center">
                <div className={`text-3xl font-black mb-2 ${verde}`}>0</div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Documentos Pendentes
                </span>
              </div>
            </Card>

            <Card dark={darkMode}>
              <div className="text-center">
                <div className={`text-3xl font-black mb-2 ${verde}`}>0</div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Confirmados Hoje
                </span>
              </div>
            </Card>

            <Card dark={darkMode}>
              <div className="text-center">
                <div className={`text-3xl font-black mb-2 ${verde}`}>0</div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Total Processado
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* Coluna lateral - Menu */}
        <div className="space-y-8">
          <Card dark={darkMode} className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              📋 Navegação
            </h3>

            <nav className="space-y-2 flex flex-col">
              <a
                href="/dp"
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  darkMode
                    ? 'bg-[#046c3b]/20 text-[#00ff87] border border-[#00ff87]/30'
                    : 'bg-green-50 text-[#046c3b] border border-green-200'
                }`}
              >
                📊 Dashboard
              </a>

              <a
                href="/dp/configuracao"
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  darkMode
                    ? 'bg-[#0f172a] text-slate-400 border border-slate-800 hover:border-[#00ff87]'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-[#046c3b]'
                }`}
              >
                ⚙️ Configuração
              </a>

              <a
                href="/dp/gestao"
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  darkMode
                    ? 'bg-[#0f172a] text-slate-400 border border-slate-800 hover:border-[#00ff87]'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-[#046c3b]'
                }`}
              >
                📁 Gestão de Documentos
              </a>
            </nav>
          </Card>

          {/* Status do Sistema */}
          <Card dark={darkMode} className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              🔧 Status do Sistema
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Recebimento</span>
                <span
                  className={`text-xs font-black px-2 py-1 rounded-lg ${
                    darkMode
                      ? 'bg-red-950/40 text-red-400 border border-red-500/30'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}
                >
                  ❌ Desativado
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Próxima Janela</span>
                <span className={`text-xs font-bold ${verde}`}>
                  Não configurado
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Último Acesso</span>
                <span className="text-xs font-bold text-slate-500">Agora</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

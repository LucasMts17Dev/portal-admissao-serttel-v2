'use client';

import { useState } from 'react';
import Link from "next/link";

export default function Home() {
  // Define o Modo Claro (false) como o padrão inicial do site
  const [darkMode, setDarkMode] = useState(false);

  const verdeText = darkMode ? 'text-[#00ff87]' : 'text-[#046c3b]';

  return (
    <main className={`relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden transition-colors duration-300 ${
      darkMode ? 'bg-[#0b132b] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Botão para Alternar o Tema (Idêntico ao resto do sistema) */}
      <div className="absolute top-5 right-5 z-50">
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
            darkMode
              ? 'bg-[#111c44]/60 border-slate-700 text-[#00ff87] hover:border-[#00ff87]'
              : 'bg-white border-slate-300 text-[#046c3b] hover:bg-slate-200'
          }`}
        >
          {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>
      </div>

      {/* Brilhos de fundo futuristas (Ativos apenas no modo escuro) */}
      {darkMode && (
        <>
          <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#046c3b]/20 blur-[130px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#00ff87]/10 blur-[150px] pointer-events-none animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none" />
        </>
      )}

      <div className="relative z-10 max-w-3xl w-full text-center">
        {/* Logo Centralizada e Sem Erros de Carregamento */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {darkMode && <div className="absolute inset-0 bg-[#00ff87]/20 blur-2xl rounded-full" />}
            <img
              src="/logo-serttel.png"
              alt="Serttel"
              className="relative w-[180px] object-contain drop-shadow-[0_0_25px_rgba(0,255,135,0.25)]"
            />
          </div>
        </div>

        <span className={`text-[11px] font-black tracking-[0.3em] uppercase block mb-3 ${verdeText}`}>
          Serttel Ecosystem
        </span>
        <h1 className={`text-4xl sm:text-5xl font-black tracking-tight mb-3 ${
          darkMode ? 'bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent' : 'text-slate-800'
        }`}>
          Portal Serttel
        </h1>
        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} mb-14 text-sm`}>
          Selecione como deseja acessar
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Card Admissão do Candidato */}
          <Link
            href="/admissao"
            className={`group relative rounded-2xl border p-8 text-left overflow-hidden transition-all duration-300 ${
              darkMode 
                ? 'border-slate-800 bg-[#111c44]/50 backdrop-blur-xl hover:border-[#00ff87] hover:shadow-[0_0_30px_rgba(0,255,135,0.15)]' 
                : 'border-slate-200 bg-white hover:border-[#046c3b] hover:shadow-lg'
            }`}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#046c3b] to-[#00ff87] flex items-center justify-center text-lg mb-5 shadow-[0_0_15px_rgba(0,255,135,0.3)]">
                👤
              </div>
              <h2 className={`text-lg font-black mb-1 tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                Sou Candidato
              </h2>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Preencher formulário de admissão
              </p>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity ${verdeText}`}>
                Acessar →
              </span>
            </div>
          </Link>

          {/* Card Módulo do Gestor */}
          <Link
            href="/login"
            className={`group relative rounded-2xl border p-8 text-left overflow-hidden transition-all duration-300 ${
              darkMode 
                ? 'border-slate-800 bg-[#111c44]/50 backdrop-blur-xl hover:border-[#00ff87] hover:shadow-[0_0_30px_rgba(0,255,135,0.15)]' 
                : 'border-slate-200 bg-white hover:border-[#046c3b] hover:shadow-lg'
            }`}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#046c3b] to-[#00ff87] flex items-center justify-center text-lg mb-5 shadow-[0_0_15px_rgba(0,255,135,0.3)]">
                🔐
              </div>
              <h2 className={`text-lg font-black mb-1 tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                Sou Gestor
              </h2>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Acessar módulo de auditoria
              </p>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity ${verdeText}`}>
                Acessar →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
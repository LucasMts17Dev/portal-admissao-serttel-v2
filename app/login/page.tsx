'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BackButton from '../components/BackButton';

export default function LoginPage() {
  const [darkMode, setDarkMode] = useState(false); // Padrão Claro configurado como false
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    const result = await signIn('credentials', {
      email,
      senha,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/auditoria');
    } else {
      setErro('E-mail ou senha incorretos.');
      setCarregando(false);
    }
  }

  const verde = darkMode ? 'text-[#00ff87]' : 'text-[#046c3b]';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden transition-colors duration-300 ${
      darkMode ? 'bg-[#0b132b] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      <BackButton />

      {/* Botão de alternar tema fixado no topo direito */}
      <div className="absolute top-5 right-5 z-50">
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
            darkMode
              ? 'bg-[#111c44]/60 border-slate-700 text-[#00ff87] hover:border-[#00ff87]'
              : 'bg-white border-slate-300 text-[#046c3b] hover:bg-slate-100'
          }`}
        >
          {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>
      </div>

      {/* Glows decorativos controlados pelo Dark Mode */}
      {darkMode && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#046c3b]/10 blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#00ff87]/5 blur-[150px] pointer-events-none animate-pulse" />
        </>
      )}

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-6">
          {/* Logo Serttel centralizada acima do título com tratamento anti-quebra */}
          <div className="relative mb-4 flex justify-center">
            {darkMode && <div className="absolute inset-0 bg-[#00ff87]/10 blur-xl rounded-full" />}
            <img
              src="/logo-serttel.png"
              alt="Serttel"
              className="relative w-[160px] object-contain drop-shadow-[0_0_15px_rgba(0,255,135,0.15)]"
            />
          </div>
          <span className={`text-[10px] font-black tracking-widest uppercase ${verde}`}>Serttel Ecosystem</span>
          <h1 className={`text-2xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Área do Gestor</h1>
          <p className="text-xs text-slate-400 mt-1">Acesso restrito — Módulo de Auditoria</p>
        </div>

        <div className={`rounded-3xl p-8 shadow-2xl relative border transition-all duration-300 ${
          darkMode ? 'bg-[#111c44]/60 border-slate-800/80 backdrop-blur-xl' : 'bg-white border-slate-200'
        }`}>
          {darkMode && (
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#046c3b] via-[#00ff87] to-transparent rounded-t-3xl" />
          )}

          <form onSubmit={handleLogin} method="POST" className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gestor@serttel.com.br"
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
                  darkMode 
                    ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' 
                    : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'
                }`}
                required
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
                  darkMode 
                    ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' 
                    : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'
                }`}
                required
              />
            </div>

            {erro && (
              <div className="bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-3 rounded-xl">
                ❌ {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className={`w-full text-white font-black text-sm py-3 rounded-xl transition-all disabled:opacity-40 cursor-pointer hover:brightness-110 active:scale-[0.985] ${
                darkMode
                  ? 'bg-gradient-to-r from-[#046c3b] to-[#00ff87] shadow-[0_0_20px_rgba(0,255,135,0.25)]'
                  : 'bg-[#046c3b]'
              }`}
            >
              {carregando ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verificando…
                </span>
              ) : '🔐 Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Acesso não autorizado é monitorado e registrado.
        </p>
      </div>
    </div>
  );
}
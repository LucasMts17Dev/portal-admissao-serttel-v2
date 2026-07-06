'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
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

  return (
    <div className="min-h-screen bg-[#0b132b] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#046c3b]/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#00ff87]/5 blur-[150px] pointer-events-none animate-pulse" />

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#046c3b] to-[#00ff87] flex items-center justify-center font-black text-3xl text-white shadow-[0_0_30px_rgba(0,255,135,0.3)] mb-4">
            S
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase text-[#00ff87]">Serttel Ecosystem</span>
          <h1 className="text-2xl font-black text-white mt-1">Área do Gestor</h1>
          <p className="text-xs text-slate-400 mt-1">Acesso restrito — Módulo de Auditoria</p>
        </div>

        <div className="bg-[#111c44]/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#046c3b] via-[#00ff87] to-transparent rounded-t-3xl" />

          {/* MUDANÇA AQUI: Adicionado method="POST" para travar o comportamento do NextAuth */}
          <form onSubmit={handleLogin} method="POST" className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gestor@serttel.com.br"
                className="w-full bg-[#0f172a]/60 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00ff87] transition-colors"
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
                className="w-full bg-[#0f172a]/60 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00ff87] transition-colors"
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
              className="w-full bg-gradient-to-r from-[#046c3b] to-[#00ff87] text-white font-black text-sm py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,135,0.25)] hover:brightness-110 active:scale-[0.985] transition-all disabled:opacity-40 cursor-pointer"
            >
              {carregando ? (                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verificando…
                </span>
              ) : '🔐 Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Acesso não autorizado é monitorado e registrado.
        </p>
      </div>
    </div>
  );
}
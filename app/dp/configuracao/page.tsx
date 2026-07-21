'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import BackButton from '../../components/BackButton';

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

interface ToggleBotaoProps {
  ativo: boolean;
  onChange: (valor: boolean) => void;
  dark: boolean;
}

function ToggleBotao({ ativo, onChange, dark }: ToggleBotaoProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!ativo)}
      className={`w-14 h-8 rounded-full flex items-center px-1 transition-all duration-300 relative cursor-pointer border-2 ${
        ativo
          ? dark
            ? 'bg-[#00ff87]/10 border-[#00ff87] shadow-[0_0_10px_rgba(0,255,135,0.3)]'
            : 'bg-[#046c3b]/10 border-[#046c3b]'
          : dark
          ? 'bg-slate-800 border-slate-600'
          : 'bg-slate-200 border-slate-300'
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full transition-all duration-300 ${
          ativo
            ? dark
              ? 'bg-[#00ff87] shadow-[0_0_8px_rgba(0,255,135,0.6)] translate-x-6'
              : 'bg-[#046c3b] translate-x-6'
            : dark
            ? 'bg-slate-600'
            : 'bg-slate-400'
        }`}
      />
    </button>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

interface Configuracao {
  dias_mes: number[];
  hora_inicio: string;
  hora_fim: string;
  ativo: boolean;
}

export default function ConfiguracaoPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const [config, setConfig] = useState<Configuracao>({
    dias_mes: [],
    hora_inicio: '09:00',
    hora_fim: '17:00',
    ativo: true,
  });

  const verde = darkMode ? 'text-[#00ff87]' : 'text-[#046c3b]';

  // Buscar configuração existente
  useEffect(() => {
    async function buscarConfiguracao() {
      try {
        setCarregando(true);
        const response = await fetch('/api/dp/configuracao');
        const data = await response.json();

        if (response.ok && data.data) {
          setConfig(data.data);
        }
      } catch (err) {
        console.error('Erro ao buscar configuração:', err);
      } finally {
        setCarregando(false);
      }
    }

    buscarConfiguracao();
  }, []);

  // Atualizar campo de configuração
  function atualizarConfig(campo: keyof Configuracao, valor: boolean | string | number[]) {
    setConfig(prev => ({
      ...prev,
      [campo]: valor,
    }));
  }

  // Alternar dia do mês
  function alternarDia(dia: number) {
    setConfig(prev => {
      const diasAtual = prev.dias_mes || [];
      if (diasAtual.includes(dia)) {
        return {
          ...prev,
          dias_mes: diasAtual.filter(d => d !== dia),
        };
      } else {
        return {
          ...prev,
          dias_mes: [...diasAtual, dia].sort((a, b) => a - b),
        };
      }
    });
  }

  // Salvar configuração
  async function salvarConfiguracao(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setMensagem('');
    setErro('');

    try {
      const response = await fetch('/api/dp/configuracao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem('✅ Configuração salva com sucesso!');
        setTimeout(() => setMensagem(''), 3000);
      } else {
        setErro(data.erro || 'Erro ao salvar configuração');
      }
    } catch (err) {
      setErro('Erro ao salvar configuração');
      console.error(err);
    } finally {
      setSalvando(false);
    }
  }

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
                  : 'text-slate-800'
              }`}
            >
              Configuração
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
            darkMode
              ? 'bg-[#00ff87]/10 border-[#00ff87] text-[#00ff87] hover:bg-[#00ff87]/20 shadow-[0_0_10px_rgba(0,255,135,0.2)]'
              : 'bg-[#046c3b]/10 border-[#046c3b] text-[#046c3b] hover:bg-[#046c3b]/20'
          }`}
        >
          {darkMode ? '☀️ Claro' : '🌙 Escuro'}
        </button>
      </nav>

      {/* Layout Principal com Sidebar */}
      <div className="max-w-7xl w-full mx-auto my-10 px-4 grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        {/* Conteúdo Principal - 3 colunas */}
        <div className="lg:col-span-3 space-y-6">
          {carregando ? (
            <Card dark={darkMode} className="text-center py-12">
              <div className={`${verde} text-2xl font-black`}>Carregando...</div>
            </Card>
          ) : (
            <form onSubmit={salvarConfiguracao} className="space-y-6">
              {/* Status de Recebimento */}
              <Card dark={darkMode}>
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700/50">
                  <div>
                    <h2 className={`text-xl font-black ${verde}`}>Ativar/Desativar Recebimento</h2>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {config.ativo
                        ? '✅ Recebimento de documentos ativo'
                        : '❌ Recebimento de documentos desativado'}
                    </p>
                  </div>
                  <ToggleBotao
                    ativo={config.ativo}
                    onChange={valor => atualizarConfig('ativo', valor)}
                    dark={darkMode}
                  />
                </div>
              </Card>

              {/* Seletor de Dias do Mês */}
              <Card dark={darkMode}>
                <h2 className={`text-xl font-black ${verde} mb-6`}>Dias do Mês para Recebimento</h2>
                <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Selecione quais dias do mês o DP receberá documentos:
                </p>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(dia => (
                    <label
                      key={dia}
                      className={`flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all duration-200 border-2 font-black text-sm ${
                        config.dias_mes.includes(dia)
                          ? darkMode
                            ? 'bg-[#00ff87]/20 border-[#00ff87] text-[#00ff87]'
                            : 'bg-[#046c3b]/20 border-[#046c3b] text-[#046c3b]'
                          : darkMode
                          ? 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600'
                          : 'bg-slate-100 border-slate-300 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={config.dias_mes.includes(dia)}
                        onChange={() => alternarDia(dia)}
                        className="hidden"
                      />
                      <span>{dia}</span>
                    </label>
                  ))}
                </div>

                {config.dias_mes.length > 0 && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    darkMode ? 'bg-slate-800/30' : 'bg-slate-100'
                  }`}>
                    <strong>Dias selecionados:</strong> {config.dias_mes.join(', ')}
                  </div>
                )}

                {config.dias_mes.length === 0 && (
                  <div className={`mt-4 p-3 rounded-lg text-sm border ${
                    darkMode 
                      ? 'bg-red-950/30 border-red-500/30 text-red-400' 
                      : 'bg-red-50 border-red-200 text-red-600'
                  }`}>
                    ⚠️ Nenhum dia selecionado. O recebimento não funcionará sem datas!
                  </div>
                )}
              </Card>

              {/* Horários */}
              <Card dark={darkMode}>
                <h2 className={`text-xl font-black ${verde} mb-6`}>Horário de Funcionamento</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-black ${verde} mb-2`}>
                      Horário Inicial
                    </label>
                    <input
                      type="time"
                      value={config.hora_inicio}
                      onChange={e => atualizarConfig('hora_inicio', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 font-mono text-lg font-black transition-colors duration-300 ${
                        darkMode
                          ? 'bg-[#111c44]/50 border-slate-700 text-[#00ff87] focus:border-[#00ff87] focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,135,0.3)]'
                          : 'bg-white border-slate-300 text-[#046c3b] focus:border-[#046c3b] focus:outline-none'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-black ${verde} mb-2`}>
                      Horário Final
                    </label>
                    <input
                      type="time"
                      value={config.hora_fim}
                      onChange={e => atualizarConfig('hora_fim', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 font-mono text-lg font-black transition-colors duration-300 ${
                        darkMode
                          ? 'bg-[#111c44]/50 border-slate-700 text-[#00ff87] focus:border-[#00ff87] focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,135,0.3)]'
                          : 'bg-white border-slate-300 text-[#046c3b] focus:border-[#046c3b] focus:outline-none'
                      }`}
                    />
                  </div>
                </div>

                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  darkMode ? 'bg-slate-800/30' : 'bg-slate-100'
                }`}>
                  <strong>Janela de funcionamento:</strong> {config.hora_inicio} até {config.hora_fim}
                </div>
              </Card>

              {/* Mensagens */}
              {mensagem && (
                <Card dark={darkMode} className="bg-green-100/10 border-green-500 text-green-500">
                  <p className="font-black text-center">{mensagem}</p>
                </Card>
              )}

              {erro && (
                <Card dark={darkMode} className="bg-red-100/10 border-red-500 text-red-500">
                  <p className="font-black text-center">{erro}</p>
                </Card>
              )}

              {/* Botão Salvar */}
              <button
                type="submit"
                disabled={salvando}
                className={`w-full py-4 rounded-2xl font-black text-lg uppercase tracking-wider transition-all duration-300 ${
                  salvando
                    ? darkMode
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-300 text-slate-600 cursor-not-allowed'
                    : darkMode
                    ? 'bg-gradient-to-r from-[#046c3b] to-[#00ff87] text-white hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] cursor-pointer'
                    : 'bg-gradient-to-r from-[#046c3b] to-[#00a86b] text-white hover:shadow-lg cursor-pointer'
                }`}
              >
                {salvando ? '💾 Salvando...' : '💾 Salvar Configuração'}
              </button>
            </form>
          )}
        </div>

        {/* Sidebar de Navegação - 1 coluna */}
        <div className="space-y-8">
          <Card dark={darkMode} className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              📋 Navegação
            </h3>

            <nav className="space-y-2 flex flex-col">
              <a
                href="/dp"
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  pathname === '/dp'
                    ? darkMode
                      ? 'bg-[#046c3b]/20 text-[#00ff87] border border-[#00ff87]/30'
                      : 'bg-green-50 text-[#046c3b] border border-green-200'
                    : darkMode
                    ? 'bg-[#0f172a] text-slate-400 border border-slate-800 hover:border-[#00ff87]'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-[#046c3b]'
                }`}
              >
                📊 Dashboard
              </a>

              <a
                href="/dp/configuracao"
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  pathname === '/dp/configuracao'
                    ? darkMode
                      ? 'bg-[#046c3b]/20 text-[#00ff87] border border-[#00ff87]/30'
                      : 'bg-green-50 text-[#046c3b] border border-green-200'
                    : darkMode
                    ? 'bg-[#0f172a] text-slate-400 border border-slate-800 hover:border-[#00ff87]'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-[#046c3b]'
                }`}
              >
                ⚙️ Configuração
              </a>

              <a
                href="/dp/gestao"
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  pathname === '/dp/gestao'
                    ? darkMode
                      ? 'bg-[#046c3b]/20 text-[#00ff87] border border-[#00ff87]/30'
                      : 'bg-green-50 text-[#046c3b] border border-green-200'
                    : darkMode
                    ? 'bg-[#0f172a] text-slate-400 border border-slate-800 hover:border-[#00ff87]'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-[#046c3b]'
                }`}
              >
                📁 Gestão
              </a>
            </nav>
          </Card>

          {/* Info Card */}
          <Card dark={darkMode} className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              ℹ️ Sobre
            </h3>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Configure os dias e horários em que o DP receberá documentos aprovados pelos gestores.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

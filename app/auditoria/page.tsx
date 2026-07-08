'use client';

import { useState } from 'react';
import BackButton from '../components/BackButton';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type StatusValidacao = 'aguardando' | 'processando' | 'sucesso' | 'erro';

type CampoArquivo =
  | 'carteiraTrabalho'
  | 'cni'
  | 'certidaoCivil'
  | 'comprovanteResidencia'
  | 'comprovanteEscolaridade'
  | 'pdfContratado'
  | 'reservista'
  | 'cpfDependentes'
  | 'certidaoFilhos'
  | 'carteiraVacinacao'
  | 'frequenciaEscolar'
  | 'cnh'
  | 'certidaoDetran';

type Arquivos = Record<CampoArquivo, File | null>;

const ARQUIVOS_INICIAIS: Arquivos = {
  carteiraTrabalho: null,
  cni: null,
  certidaoCivil: null,
  comprovanteResidencia: null,
  comprovanteEscolaridade: null,
  pdfContratado: null,
  reservista: null,
  cpfDependentes: null,
  certidaoFilhos: null,
  carteiraVacinacao: null,
  frequenciaEscolar: null,
  cnh: null,
  certidaoDetran: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function arquivoParaBase64(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        resolve({ inlineData: { data: base64Data, mimeType: file.type } });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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
    <div
      className={`p-4 border rounded-2xl flex flex-col justify-between space-y-3 ${
        dark ? 'bg-[#1c2754]/40 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}
    >
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

interface InputArquivoProps {
  label: string;
  campo: CampoArquivo;
  arquivo: File | null;
  onChange: (campo: CampoArquivo, file: File | null) => void;
  dark: boolean;
  disabled?: boolean;
  accept?: string;
  className?: string;
  corLabel?: string;
  corFundo?: string;
  corBorda?: string;
}

function InputArquivo({
  label,
  campo,
  arquivo,
  onChange,
  dark,
  disabled = false,
  accept = 'application/pdf,image/*',
  className = '',
  corLabel,
  corFundo,
  corBorda,
}: InputArquivoProps) {
  const fundoPadrao = dark ? 'bg-[#0f172a]/60 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600';
  const fundoDesabilitado = 'bg-slate-950/20 border-slate-900/50 opacity-30 pointer-events-none select-none';

  return (
    <div
      className={`flex flex-col gap-2 p-4 border rounded-xl transition-all ${
        disabled ? fundoDesabilitado : corFundo ? `${corFundo} ${corBorda}` : fundoPadrao
      } ${className}`}
    >
      <label className={`text-[11px] font-black uppercase ${corLabel ?? 'text-slate-400'}`}>
        {label}
      </label>

      {disabled ? (
        // Quando desabilitado, mostra apenas um traço — sem input nativo que exibe "Nenhum arquivo escolhido"
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

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function AuditoriaPage() {
  const [darkMode, setDarkMode] = useState(false);

  const [exigeMilitar, setExigeMilitar] = useState<boolean | null>(null);
  const [exigeDependentes, setExigeDependentes] = useState<boolean | null>(null);
  const [exigeSalarioFamilia, setExigeSalarioFamilia] = useState<boolean | null>(null);
  const [exigeMotorista, setExigeMotorista] = useState<boolean | null>(null);

  const [arquivos, setArquivos] = useState<Arquivos>(ARQUIVOS_INICIAIS);
  const [status, setStatus] = useState<StatusValidacao>('aguardando');
  const [respostaIA, setRespostaIA] = useState('');
  const [mostrarAlertaManual, setMostrarAlertaManual] = useState(false);
  const [avisoArquivo, setAvisoArquivo] = useState('');
  const [avisoValidacao, setAvisoValidacao] = useState('');

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleArquivo(campo: CampoArquivo, file: File | null) {
    if (file && file.size > 5 * 1024 * 1024) {
      setAvisoArquivo('Arquivo muito grande. O limite é 5 MB por documento.');
      setTimeout(() => setAvisoArquivo(''), 5000);
      return;
    }
    setAvisoArquivo('');
    setArquivos((prev) => ({ ...prev, [campo]: file }));
  }

  function limparCampos(campos: CampoArquivo[]) {
    setArquivos((prev) => {
      const next = { ...prev };
      campos.forEach((c) => (next[c] = null));
      return next;
    });
  }

  function handleMilitar(v: boolean) {
    setExigeMilitar(v);
    if (!v) limparCampos(['reservista']);
  }

  function handleDependentes(v: boolean) {
    setExigeDependentes(v);
    if (!v) {
      setExigeSalarioFamilia(null);
      limparCampos(['cpfDependentes', 'certidaoFilhos', 'carteiraVacinacao', 'frequenciaEscolar']);
    }
  }

  function handleSalarioFamilia(v: boolean) {
    setExigeSalarioFamilia(v);
    if (!v) limparCampos(['carteiraVacinacao', 'frequenciaEscolar']);
  }

  function handleMotorista(v: boolean) {
    setExigeMotorista(v);
    if (!v) limparCampos(['cnh', 'certidaoDetran']);
  }

  // ── Auditoria ─────────────────────────────────────────────────────────────

  async function handleAuditoria() {
    const obrigatorios: CampoArquivo[] = [
      'carteiraTrabalho',
      'cni',
      'certidaoCivil',
      'comprovanteResidencia',
      'comprovanteEscolaridade',
      'pdfContratado',
    ];

    const faltando = obrigatorios.some((c) => !arquivos[c]);
    if (faltando) {
      setAvisoValidacao('Preencha todos os 5 documentos obrigatórios e a Ficha Cadastral antes de continuar.');
      return;
    }

    try {
      setAvisoValidacao('');
      setStatus('processando');
      setMostrarAlertaManual(false);
      setRespostaIA('Preparando documentos para análise…');

      const promptInstrucao = `
        Você é o sistema de Auditoria de Qualificação Cadastral da Serttel, especializado em compliance do eSocial.
        Sua missão é analisar cada documento enviado e cruzá-los com a Ficha Cadastral Base (PDF).

        DOCUMENTOS OBRIGATÓRIOS ANEXADOS:
        - Carteira de Trabalho Digital (CTPS)
        - Carteira de Identidade (RG / CNI)
        - Certidão Civil
        - Comprovante de Residência
        - Comprovante de Escolaridade
        - Ficha Cadastral Base (PDF)

        REGRAS DE AUDITORIA:
        1. LEGIBILIDADE: Se algum documento estiver ilegível, borrado ou cortado, REJEITE imediatamente o lote e indique qual arquivo está com problema. Instrua: "Preencha o relatório de contingência manual devido à ilegibilidade do documento."
        2. DOCUMENTOS FALTANTES: Cruzando a Ficha Cadastral, se houver referência a filhos, CNH ou sexo masculino sem os respectivos documentos opcionais anexados, BARRE o processo informando o que está faltando.
        3. CONCILIAÇÃO DE DADOS: Extraia Nome Completo, CPF, RG, Órgão Emissor, Data de Emissão, Título de Eleitor e nome da Mãe da Ficha Base. Compare com os demais documentos usando OCR. Qualquer divergência gera rejeição.

        FORMATO DO PARECER:
        Inicie com "VEREDITO: APROVADO" ou "VEREDITO: REJEITADO COM DIVERGÊNCIAS".
        Use Markdown estruturado com seções claras apontando inconsistências e arquivos com problema.
      `;

      const partes: any[] = [promptInstrucao];

      setRespostaIA('Convertendo documentos obrigatórios…');

      const convertidos = await Promise.all(
        obrigatorios.map((c) => arquivoParaBase64(arquivos[c]!))
      );
      convertidos.forEach((p) => partes.push(p));

      setRespostaIA('Verificando documentos complementares…');

      const opcionais: CampoArquivo[] = [
        'reservista',
        'cpfDependentes',
        'certidaoFilhos',
        'carteiraVacinacao',
        'frequenciaEscolar',
        'cnh',
        'certidaoDetran',
      ];

      for (const campo of opcionais) {
        if (arquivos[campo]) {
          partes.push(await arquivoParaBase64(arquivos[campo]!));
        }
      }

      setRespostaIA('Enviando para análise…');

      // ✅ Chama a rota interna do Next.js — sem CORS, sem expor a chave no browser
      const res = await fetch('/api/auditoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partes }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.erro ?? `Erro ${res.status}`);
      }

      const texto: string = data.texto;
      setRespostaIA(texto);

      const upper = texto.toUpperCase();
      if (upper.includes('REJEITADO') || upper.includes('DIVERGÊNCIA')) {
        setStatus('erro');
        if (upper.includes('MANUAL') || upper.includes('ILEGÍVEL') || upper.includes('ILEGIVEL')) {
          setMostrarAlertaManual(true);
        }
      } else {
        setStatus('sucesso');
      }
    } catch (error: any) {
      console.error('Erro na auditoria:', error);
      setStatus('erro');
      setRespostaIA(
        `❌ ${error?.message ?? 'Falha ao processar os documentos. Verifique sua conexão e o tamanho dos arquivos, depois tente novamente.'}`
      );
    }
  }

  // ── Estilo do painel de resultado ─────────────────────────────────────────

  function classeResultado() {
    if (status === 'aguardando')
      return darkMode
        ? 'bg-[#1e293b]/50 text-slate-300 border-slate-800'
        : 'bg-slate-50 text-slate-600 border-slate-200';
    if (status === 'processando') return 'bg-[#1c2e42]/50 text-blue-400 border-blue-500/40';
    if (status === 'sucesso')
      return 'bg-[#0a2f1d]/60 text-emerald-400 border-[#00ff87]/30 shadow-[0_0_15px_rgba(0,255,135,0.1)]';
    return 'bg-red-950/40 text-red-400 border-red-500/30';
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const verde = darkMode ? 'text-[#00ff87]' : 'text-[#046c3b]';
  const fundoCondicional = (ativo: boolean | null, cor: string) =>
    ativo
      ? darkMode
        ? `bg-${cor}-900/30 border-${cor}-500/30`
        : `bg-white border-${cor}-200`
      : '';

  return (
    <div
      className={`min-h-screen font-sans relative overflow-x-hidden transition-colors duration-300 ${
        darkMode
          ? 'bg-[#0b132b] text-slate-100 selection:bg-[#00ff87]/20 selection:text-[#00ff87]'
          : 'bg-slate-50 text-slate-800'
      }`}
    >
      <BackButton />

      {/* Glows decorativos */}
      {darkMode && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#046c3b]/10 blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#00ff87]/5 blur-[150px] pointer-events-none animate-pulse" />
        </>
      )}

      {/* Navbar */}
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
              Serttel · Auditoria
            </span>
            <span
              className={`text-lg font-black tracking-tight ${
                darkMode
                  ? 'bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent'
                  : 'text-[#046c3b]'
              }`}
            >
              Qualificação Cadastral
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
            Gemini Pro Ativo
          </div>
        </div>
      </nav>

      {/* Layout principal */}
      <main className="max-w-7xl w-full mx-auto my-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-8">

          {/* 1. Parametrização */}
          <Card dark={darkMode}>
            <div className="mb-6">
              <h2 className={`text-lg font-black tracking-tight flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                <span className={verde}>⚙</span> 1. Parametrização
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure os documentos exigidos para este colaborador conforme as condições do eSocial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ToggleBotao
                label="Exigir documentação militar?"
                valor={exigeMilitar}
                onChange={handleMilitar}
                dark={darkMode}
              />
              <ToggleBotao
                label="Possui filhos / dependentes?"
                valor={exigeDependentes}
                onChange={handleDependentes}
                dark={darkMode}
              />
              <ToggleBotao
                label="Exigir CNH e certidão DETRAN?"
                valor={exigeMotorista}
                onChange={handleMotorista}
                dark={darkMode}
              />
            </div>

            {exigeDependentes && (
              <div
                className={`p-4 border rounded-2xl text-xs font-bold space-y-3 mt-4 ${
                  darkMode
                    ? 'bg-[#0a2f1d]/40 border-[#00ff87]/20 text-slate-300'
                    : 'bg-green-50/50 border-green-200 text-slate-700'
                }`}
              >
                <span className={`block ${verde}`}>✦ Benefício adicional</span>
                <span className="text-slate-400">
                  O colaborador solicitou ou tem direito ao Salário-Família?
                </span>
                <div className="flex gap-2 max-w-xs">
                  <button
                    type="button"
                    onClick={() => handleSalarioFamilia(true)}
                    className={`py-2 px-5 rounded-xl font-black border transition-all text-xs ${
                      exigeSalarioFamilia === true
                        ? 'bg-[#046c3b] text-white border-[#00ff87]'
                        : darkMode
                        ? 'bg-[#0f172a] text-slate-400 border-slate-800'
                        : 'bg-white text-slate-500 border-slate-200'
                    }`}
                  >
                    Sim, requereu
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSalarioFamilia(false)}
                    className={`py-2 px-5 rounded-xl font-black border transition-all text-xs ${
                      exigeSalarioFamilia === false
                        ? 'bg-red-950/80 text-red-400 border-red-500/50'
                        : darkMode
                        ? 'bg-[#0f172a] text-slate-400 border-slate-800'
                        : 'bg-white text-slate-500 border-slate-200'
                    }`}
                  >
                    Não
                  </button>
                </div>
              </div>
            )}
          </Card>

          {/* 2. Documentos */}
          <Card dark={darkMode} className="space-y-6">
            <div>
              <h2 className={`text-lg font-black tracking-tight flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                <span className={verde}>📥</span> 2. Upload de Documentos
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Faça o upload dos documentos enviados pelo colaborador. Limite: 5 MB por arquivo.
              </p>
            </div>

            {avisoArquivo && (
              <div className="p-3 bg-amber-950/40 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-xl">
                ⚠️ {avisoArquivo}
              </div>
            )}

            {/* Obrigatórios */}
            <div
              className={`border rounded-2xl p-4 space-y-4 ${
                darkMode ? 'bg-[#046c3b]/10 border-[#046c3b]/30' : 'bg-green-50/30 border-green-100'
              }`}
            >
              <span className={`text-xs font-black uppercase tracking-widest block ${verde}`}>
                ✦ Documentos Obrigatórios
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputArquivo label="Carteira de Trabalho (CTPS) *" campo="carteiraTrabalho" arquivo={arquivos.carteiraTrabalho} onChange={handleArquivo} dark={darkMode} />
                <InputArquivo label="Carteira de Identidade (RG / CNI) *" campo="cni" arquivo={arquivos.cni} onChange={handleArquivo} dark={darkMode} />
                <InputArquivo label="Certidão Civil (Nasc. / Casamento) *" campo="certidaoCivil" arquivo={arquivos.certidaoCivil} onChange={handleArquivo} dark={darkMode} />
                <InputArquivo label="Comprovante de Residência *" campo="comprovanteResidencia" arquivo={arquivos.comprovanteResidencia} onChange={handleArquivo} dark={darkMode} />
                <InputArquivo label="Comprovante de Escolaridade *" campo="comprovanteEscolaridade" arquivo={arquivos.comprovanteEscolaridade} onChange={handleArquivo} dark={darkMode} className="sm:col-span-2" />
              </div>
            </div>

            {/* Condicionais */}
            <div
              className={`border rounded-2xl p-4 space-y-4 ${
                darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100/50 border-slate-200'
              }`}
            >
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">
                ✦ Documentos Complementares
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputArquivo
                  label="Documentação Militar (Reservista / Dispensa)"
                  campo="reservista"
                  arquivo={arquivos.reservista}
                  onChange={handleArquivo}
                  dark={darkMode}
                  disabled={!exigeMilitar}
                  className="sm:col-span-2"
                />

                <InputArquivo
                  label="CPF dos Dependentes"
                  campo="cpfDependentes"
                  arquivo={arquivos.cpfDependentes}
                  onChange={handleArquivo}
                  dark={darkMode}
                  disabled={!exigeDependentes}
                  corLabel={darkMode ? 'text-indigo-300' : 'text-indigo-700'}
                  corFundo={darkMode ? 'bg-[#1a2042]/50' : 'bg-white'}
                  corBorda={darkMode ? 'border-indigo-500/30' : 'border-indigo-200'}
                />
                <InputArquivo
                  label="Certidão de Nascimento dos Filhos (até 14 anos)"
                  campo="certidaoFilhos"
                  arquivo={arquivos.certidaoFilhos}
                  onChange={handleArquivo}
                  dark={darkMode}
                  disabled={!exigeDependentes}
                  corLabel={darkMode ? 'text-indigo-300' : 'text-indigo-700'}
                  corFundo={darkMode ? 'bg-[#1a2042]/50' : 'bg-white'}
                  corBorda={darkMode ? 'border-indigo-500/30' : 'border-indigo-200'}
                />

                <InputArquivo
                  label="Carteira de Vacinação (até 6 anos)"
                  campo="carteiraVacinacao"
                  arquivo={arquivos.carteiraVacinacao}
                  onChange={handleArquivo}
                  dark={darkMode}
                  disabled={!exigeDependentes || !exigeSalarioFamilia}
                  corLabel={darkMode ? 'text-purple-300' : 'text-purple-700'}
                  corFundo={darkMode ? 'bg-[#251b47]/50' : 'bg-white'}
                  corBorda={darkMode ? 'border-purple-500/30' : 'border-purple-200'}
                />
                <InputArquivo
                  label="Frequência Escolar (até 14 anos)"
                  campo="frequenciaEscolar"
                  arquivo={arquivos.frequenciaEscolar}
                  onChange={handleArquivo}
                  dark={darkMode}
                  disabled={!exigeDependentes || !exigeSalarioFamilia}
                  corLabel={darkMode ? 'text-purple-300' : 'text-purple-700'}
                  corFundo={darkMode ? 'bg-[#251b47]/50' : 'bg-white'}
                  corBorda={darkMode ? 'border-purple-500/30' : 'border-purple-200'}
                />

                <InputArquivo
                  label="Habilitação (CNH)"
                  campo="cnh"
                  arquivo={arquivos.cnh}
                  onChange={handleArquivo}
                  dark={darkMode}
                  disabled={!exigeMotorista}
                  corLabel={darkMode ? 'text-blue-300' : 'text-blue-700'}
                  corFundo={darkMode ? 'bg-[#1c2e42]/50' : 'bg-white'}
                  corBorda={darkMode ? 'border-blue-500/30' : 'border-blue-200'}
                />
                <InputArquivo
                  label="Certidão do DETRAN (Nada Consta)"
                  campo="certidaoDetran"
                  arquivo={arquivos.certidaoDetran}
                  onChange={handleArquivo}
                  dark={darkMode}
                  disabled={!exigeMotorista}
                  corLabel={darkMode ? 'text-blue-300' : 'text-blue-700'}
                  corFundo={darkMode ? 'bg-[#1c2e42]/50' : 'bg-white'}
                  corBorda={darkMode ? 'border-blue-500/30' : 'border-blue-200'}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-8">

          {/* 3. Ficha mestre */}
          <Card dark={darkMode} className="space-y-4">
            <div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                3. Ficha Cadastral
              </h2>
              <p className="text-[11px] text-slate-400 mt-1">
                Insira o PDF gerado no Portal do Candidato.
              </p>
            </div>

            <div
              className={`flex flex-col gap-2 p-5 border-2 border-dashed rounded-2xl text-center ${
                darkMode
                  ? 'border-[#00ff87]/30 bg-[#0a2f1d]/10'
                  : 'border-[#046c3b]/20 bg-green-50/20'
              }`}
            >
              <label className={`text-xs font-black uppercase tracking-wide ${verde}`}>
                Ficha Cadastral (PDF) *
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleArquivo('pdfContratado', e.target.files?.[0] ?? null)}
                className="text-xs mx-auto text-slate-400 cursor-pointer"
              />
              {arquivos.pdfContratado && (
                <span className="text-[11px] text-green-400 font-black block mt-2 animate-pulse">
                  📂 {arquivos.pdfContratado.name}
                </span>
              )}
            </div>

            {avisoValidacao && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl">
                ❌ {avisoValidacao}
              </div>
            )}

            <button
              type="button"
              onClick={handleAuditoria}
              disabled={status === 'processando'}
              className={`w-full text-white font-black text-xs py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 hover:brightness-110 active:scale-[0.985] ${
                darkMode
                  ? 'bg-gradient-to-r from-[#046c3b] to-[#00ff87] shadow-[0_0_20px_rgba(0,255,135,0.25)]'
                  : 'bg-[#046c3b]'
              }`}
            >
              {status === 'processando' ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analisando documentos…
                </span>
              ) : (
                '🔍 Iniciar Auditoria'
              )}
            </button>
          </Card>

          {/* 4. Resultado */}
          <Card dark={darkMode} className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 tracking-widest uppercase">
              Parecer da Auditoria
            </h4>

            <div
              className={`p-5 rounded-2xl text-xs font-semibold whitespace-pre-line leading-relaxed border relative overflow-hidden transition-colors ${classeResultado()}`}
            >
              {status === 'processando' && (
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ff87] shadow-[0_0_10px_#00ff87] animate-scan" />
              )}
              {status === 'aguardando'
                ? '⏳ Aguardando upload dos documentos para iniciar a análise.'
                : respostaIA}
            </div>

            {mostrarAlertaManual && (
              <div className="p-4 bg-amber-950/60 border border-amber-500/40 text-amber-300 rounded-2xl text-[11px] leading-relaxed space-y-2">
                <p className="font-black text-xs uppercase flex items-center gap-1">
                  ⚠️ Ação necessária: Relatório Manual
                </p>
                <p>
                  Um ou mais documentos estão ilegíveis. A auditoria automática não pode ser
                  concluída. Preencha o relatório de contingência manualmente.
                </p>
                <button
                  type="button"
                  onClick={() => alert('📋 Abrindo relatório de contingência…')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-black px-3 py-1.5 rounded-lg transition-colors block text-[10px] uppercase"
                >
                  Preencher Relatório Manual
                </button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

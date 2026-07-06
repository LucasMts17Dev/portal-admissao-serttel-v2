'use client';

import { useState } from 'react';

interface Dependente {
  nome: string;
  cpf: string;
  nascimento: string;
}

export default function FormularioPage() {
  // Estado do Tema (Futurista / Clássico-Claro)
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Estados de Controle Geral
  const [hasDependents, setHasDependents] = useState<boolean | null>(null);
  const [querSalarioFamilia, setQuerSalarioFamilia] = useState<boolean | null>(null);
  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [isMotorista, setIsMotorista] = useState<boolean | null>(null);
  const [hasItau, setHasItau] = useState<boolean | null>(null);
  const [temReservista, setTemReservista] = useState<boolean | null>(null);

  // SEÇÃO 1: Dados Pessoais e Filiação
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpfTitular, setCpfTitular] = useState('');
  const [dataNascimento, setDataNascimento] = useState(''); 
  const [estadoCivil, setEstadoCivil] = useState('');
  const [naturalidade, setNaturalidade] = useState('');
  const [escolaridade, setEscolaridade] = useState('');
  const [etnia, setEtnia] = useState('');
  const [sexo, setSexo] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [nomePai, setNomePai] = useState('');
  
  // Documentos Básicos e Militares
  const [numeroRg, setNumeroRg] = useState('');
  const [orgaoEmissor, setOrgaoEmissor] = useState('');
  const [localEmissaoUf, setLocalEmissaoUf] = useState('');
  const [dataEmissaoRg, setDataEmissaoRg] = useState('');
  const [tituloEleitor, setTituloEleitor] = useState('');
  const [ctpsDigital, setCtpsDigital] = useState('');
  const [numeroReservista, setNumeroReservista] = useState('');

  // CNH (Integrada à Seção 1)
  const [numeroCnh, setNumeroCnh] = useState('');
  const [categoriaCnh, setCategoriaCnh] = useState('');
  const [dataEmissaoCnh, setDataEmissaoCnh] = useState('');

  // SEÇÃO 2: Contato e Endereço
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [telefoneRecado, setTelefoneRecado] = useState('');

  // SEÇÃO 4: Dados Bancários
  const [agencia, setAgencia] = useState('');
  const [contaCorrente, setContaCorrente] = useState('');

  // SEÇÃO 5: Vale Transporte
  const [querVt, setQuerVt] = useState<boolean | null>(null);
  const [qtdIda, setQtdIda] = useState('');
  const [qtdVinda, setQtdVinda] = useState('');
  const [valorPassagem, setValorPassagem] = useState('');

  // Validação de CPF (Módulo 11)
  const validarCPF = (rawCpf: string): boolean => {
    const cpfLimpo = rawCpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    let digito1 = resto === 10 || resto === 11 ? 0 : resto;
    if (digito1 !== parseInt(cpfLimpo.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    let digito2 = resto === 10 || resto === 11 ? 0 : resto;
    return digito2 === parseInt(cpfLimpo.charAt(10));
  };

  // Funções de Máscaras
  const formatarCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').substring(0, 14);
  const formatarData = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 10);
  const formatarTelefone = (v: string) => v.replace(/\D/g, '').replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 15);
  const formatarCEP = (v: string) => v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);

  // Busca de CEP por API
  const handleCepBlur = async () => {
    const limpaCep = cep.replace(/\D/g, '');
    if (limpaCep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${limpaCep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setLogradouro(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setUf(data.uf || '');
      } else {
        alert("❌ CEP não encontrado!");
      }
    } catch (e) {
      console.error("Erro ao buscar o CEP", e);
    }
  };

  const addDependente = () => {
    setDependentes([...dependentes, { nome: '', cpf: '', nascimento: '' }]);
  };

  const handleGerarPDF = () => {
    if (!validarCPF(cpfTitular)) {
      alert("❌ O CPF do Colaborador informado é inválido!");
      return;
    }

    if (
      !nomeCompleto.trim() || 
      !dataNascimento.trim() || 
      !estadoCivil || 
      !naturalidade.trim() ||
      !escolaridade ||
      !etnia ||
      !sexo ||
      !nomeMae.trim() ||
      !numeroRg.trim() ||
      !orgaoEmissor.trim() ||
      !localEmissaoUf.trim() ||
      !dataEmissaoRg.trim() ||
      !tituloEleitor.trim() ||
      !ctpsDigital.trim() ||
      !cep.trim() ||
      !logradouro.trim() ||
      !bairro.trim() ||
      !cidade.trim() ||
      !uf.trim() ||
      !numero.trim() ||
      !email.trim() ||
      !telefone.trim()
    ) {
      alert("❌ Por favor, preencha todos os campos obrigatórios marcados com (*).");
      return;
    }

    if (sexo.toLowerCase() === 'masculino') {
      if (temReservista === null) {
        alert("❌ Informe a situação sobre o Certificado de Reservista ou Alistamento Militar!");
        return;
      }
      if (temReservista && !numeroReservista.trim()) {
        alert("❌ Digite o número do Certificado de Reservista / Alistamento!");
        return;
      }
    }

    if (isMotorista === null) { alert("❌ Responda se exigirá veículo corporativo!"); return; }
    if (isMotorista && (!numeroCnh.trim() || !categoriaCnh || !dataEmissaoCnh.trim())) {
      alert("❌ Preencha os campos obrigatórios da sua CNH na Seção 1!");
      return;
    }

    if (hasDependents === null) { alert("❌ Selecione se possui ou não filhos/dependentes!"); return; }
    if (hasDependents && querSalarioFamilia === null) { alert("❌ Selecione se deseja requerer o Salário-Família!"); return; }
    if (hasDependents && dependentes.length > 0) {
      for (let i = 0; i < dependentes.length; i++) {
        const dep = dependentes[i];
        if (!dep.nome.trim() || !dep.cpf.trim() || !dep.nascimento.trim()) {
          alert(`❌ Preencha todos os dados solicitados do dependente número ${i + 1}!`);
          return;
        }
        if (!validarCPF(dep.cpf)) {
          alert(`❌ O CPF do dependente número ${i + 1} está incorreto!`);
          return;
        }
      }
    }

    if (hasItau === null) { alert("❌ Informe se possui conta corrente no Itaú!"); return; }
    if (hasItau && (!agencia.trim() || !contaCorrente.trim())) {
      alert("❌ Preencha a agência e conta corrente vinculadas ao Itaú!");
      return;
    }

    if (querVt === null) { alert("❌ Selecione uma opção para o benefício do Vale Transporte!"); return; }
    if (querVt && (!qtdIda.trim() || !qtdVinda.trim() || !valorPassagem.trim())) {
      alert("❌ Forneça a rota (ida/vinda) e valores do Vale Transporte!");
      return;
    }

    window.print();
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col justify-between transition-colors duration-300 ${
      darkMode 
        ? 'bg-[#0b132b] text-slate-100 selection:bg-[#00ff87]/20 selection:text-[#00ff87]' 
        : 'bg-slate-50 text-slate-800 selection:bg-[#046c3b]/10'
    } print:bg-white print:text-black`}>
      
      {/* Glows de Fundo Futuristas (Apenas modo escuro) */}
      {darkMode && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#046c3b]/10 blur-[120px] pointer-events-none animate-pulse print:hidden" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#00ff87]/5 blur-[150px] pointer-events-none animate-pulse print:hidden" />
        </>
      )}

      {/* Header Futurista */}
      <header className={`px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-50 transition-colors ${
        darkMode ? 'bg-[#0b132b]/80 border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.4)]' : 'bg-white/90 border-slate-200 shadow-sm'
      } print:hidden`}>
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl overflow-hidden relative group transition-all ${
            darkMode ? 'bg-gradient-to-tr from-[#046c3b] to-[#00ff87] text-white shadow-[0_0_15px_rgba(0,255,135,0.3)]' : 'bg-[#046c3b] text-white shadow-sm'
          }`}>
            S
          </div>
          <div>
            <span className={`text-[10px] font-black tracking-widest block uppercase ${darkMode ? 'text-[#00ff87]' : 'text-slate-400'}`}>Serttel Ecosystem</span>
            <span className={`text-lg font-black tracking-tight ${darkMode ? 'bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent' : 'text-[#046c3b]'}`}>Portal de Admissão</span>
          </div>
        </div>
        
        {/* Botão de Troca de Tema (Claro / Escuro) */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
            darkMode 
              ? 'bg-[#111c44]/60 border-slate-700 text-[#00ff87] hover:border-[#00ff87] shadow-[inset_0_0_10px_rgba(0,255,135,0.1)]' 
              : 'bg-slate-100 border-slate-300 text-[#046c3b] hover:bg-slate-200'
          }`}
        >
          {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>
      </header>

      {/* Conteúdo Formuário Corrido */}
      <main className="max-w-4xl w-full mx-auto my-10 px-4 flex-grow print:my-0 print:px-0 print:max-w-full relative z-10">
        <div className={`rounded-2xl p-6 md:p-10 space-y-12 transition-all duration-300 ${
          darkMode 
            ? 'bg-[#111c44]/50 border border-slate-800/80 backdrop-blur-xl shadow-2xl' 
            : 'bg-white border border-slate-200 shadow-sm'
        } print:border-0 print:shadow-none print:p-0 print:bg-transparent`}>
          
          <div className={`text-center pb-6 border-b flex justify-between items-center ${darkMode ? 'border-slate-800' : 'border-[#046c3b]'}`}>
            <div className="text-left">
              <h2 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-[#046c3b]'} print:text-black print:text-xl`}>Ficha de Admissão de Funcionário</h2>
              <p className="text-slate-400 text-xs mt-1 print:hidden">Preencha os campos abaixo para consolidar seu relatório de entrega documental.</p>
            </div>
            <div className="hidden print:block text-right text-xs font-bold text-slate-400">SERTTEL ADMISSÕES</div>
          </div>

          {/* SEÇÃO 1: INFORMAÇÕES PESSOAIS */}
          <section className="space-y-6 print:break-inside-avoid">
            <h3 className={`text-sm font-black uppercase tracking-wider pb-2 border-b flex items-center gap-2 ${darkMode ? 'text-[#00ff87] border-slate-800' : 'text-[#046c3b] border-slate-100'} print:text-black print:border-black`}>
              <span>👤</span> 1. Informações Pessoais, Filiação e Documentação
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Nome Completo *</label>
                <input type="text" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm uppercase outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="Nome Completo do Colaborador" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">CPF *</label>
                <input 
                  type="text" 
                  value={cpfTitular} 
                  onChange={(e) => setCpfTitular(formatarCPF(e.target.value))} 
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors print:border-none print:p-0 print:font-bold ${
                    cpfTitular.replace(/\D/g, '').length === 11 
                      ? validarCPF(cpfTitular) 
                        ? 'border-green-500 bg-green-50/10 text-green-400' 
                        : 'border-red-500 bg-red-50/10 text-red-400'
                      : darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'
                  }`} 
                  placeholder="000.000.000-00" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Nome da Mãe *</label>
                <input type="text" value={nomeMae} onChange={(e) => setNomeMae(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm uppercase outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="NOME COMPLETO DA MÃE" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Nome do Pai</label>
                <input type="text" value={nomePai} onChange={(e) => setNomePai(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm uppercase outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="NOME COMPLETO DO PAI" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">RG / CNI *</label>
                <input type="text" value={numeroRg} onChange={(e) => setNumeroRg(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="Apenas números" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Órgão Emissor *</label>
                <input type="text" value={orgaoEmissor} onChange={(e) => setOrgaoEmissor(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm uppercase outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="Ex: SSP, SDS" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">UF Emissão *</label>
                <input type="text" value={localEmissaoUf} onChange={(e) => setLocalEmissaoUf(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm uppercase outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="UF" maxLength={2} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Data Emissão RG *</label>
                <input type="text" value={dataEmissaoRg} onChange={(e) => setDataEmissaoRg(formatarData(e.target.value))} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="DD/MM/AAAA" maxLength={10} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Título de Eleitor *</label>
                <input type="text" value={tituloEleitor} onChange={(e) => setTituloEleitor(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="Número do título" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Carteira de Trabalho Digital *</label>
                <input type="text" value={ctpsDigital} onChange={(e) => setCtpsDigital(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="Número da CTPS" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Data de Nascimento *</label>
                <input type="text" value={dataNascimento} onChange={(e) => setDataNascimento(formatarData(e.target.value))} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="DD/MM/AAAA" maxLength={10} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Estado Civil *</label>
                <select value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold print:bg-transparent`}>
                  <option value="">Selecione...</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-1 col-span-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Naturalidade *</label>
                <input type="text" value={naturalidade} onChange={(e) => setNaturalidade(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="Cidade / UF" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Escolaridade *</label>
                <select value={escolaridade} onChange={(e) => setEscolaridade(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold print:bg-transparent`}>
                  <option value="">Selecione...</option>
                  <option value="fundamental">Ensino Fundamental</option>
                  <option value="medio">Ensino Médio</option>
                  <option value="superior">Ensino Superior</option>
                  <option value="pos">Pós-Graduação</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Raça / Etnia *</label>
                <select value={etnia} onChange={(e) => setEtnia(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold print:bg-transparent`}>
                  <option value="">Selecione...</option>
                  <option value="branca">Branca</option>
                  <option value="preta">Preta</option>
                  <option value="parda">Parda</option>
                  <option value="amarela">Amarela</option>
                  <option value="indigena">Indígena</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Sexo / Gênero *</label>
                <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold print:bg-transparent`}>
                  <option value="">Selecione...</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            {/* Condicional Militar */}
            {sexo.toLowerCase() === 'masculino' && (
              <div className={`p-4 border rounded-xl space-y-3 print:p-0 print:border-0 ${darkMode ? 'bg-[#1c2754]/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <label className="text-[11px] font-bold text-slate-400 uppercase block">Possui Certificado de Reservista ou Dispensa de Alistamento Militar? *</label>
                <div className="flex gap-3 print:hidden">
                  <button type="button" onClick={() => setTemReservista(true)} className={`rounded-xl px-5 py-2 text-xs font-bold border transition-all ${temReservista === true ? 'bg-[#046c3b] border-[#00ff87] text-white shadow-[0_0_10px_rgba(0,255,135,0.2)]' : darkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>Sim</button>
                  <button type="button" onClick={() => { setTemReservista(false); setNumeroReservista(''); }} className={`rounded-xl px-5 py-2 text-xs font-bold border transition-all ${temReservista === false ? 'bg-gradient-to-r from-red-950 to-red-900 border-red-500 text-red-200' : darkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>Não / Dispensado</button>
                </div>
                {temReservista && (
                  <div className="flex flex-col gap-1.5 pt-1 animate-fadeIn">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Nº do Certificado de Reservista / Alistamento *</label>
                    <input type="text" value={numeroReservista} onChange={(e) => setNumeroReservista(e.target.value)} className={`border rounded-xl px-4 py-2 text-sm outline-none max-w-md ${darkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'} print:border-none`} placeholder="Número do documento militar" />
                  </div>
                )}
              </div>
            )}

            {/* Condicional de Uso de Veículo */}
            <div className={`p-4 border border-dashed rounded-xl print:p-0 print:border-none ${darkMode ? 'bg-[#1c2754]/10 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-2">Exercerá a Função de Motorista? *</label>
              <div className="flex gap-3 print:hidden mb-1">
                <button type="button" onClick={() => setIsMotorista(true)} className={`rounded-xl px-5 py-2 text-xs font-bold border transition-all ${isMotorista === true ? 'bg-[#046c3b] border-[#00ff87] text-white shadow-[0_0_10px_rgba(0,255,135,0.2)]' : darkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>Sim</button>
                <button type="button" onClick={() => { setIsMotorista(false); setNumeroCnh(''); setCategoriaCnh(''); setDataEmissaoCnh(''); }} className={`rounded-xl px-5 py-2 text-xs font-bold border transition-all ${isMotorista === false ? 'bg-gradient-to-r from-red-950 to-red-900 border-red-500 text-red-200' : darkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>Não</button>
              </div>
              
              {isMotorista && (
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 border rounded-xl mt-3 animate-fadeIn print:p-0 print:border-0 ${darkMode ? 'bg-[#0f172a]/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Nº do Registro da CNH *</label>
                    <input type="text" value={numeroCnh} onChange={(e) => setNumeroCnh(e.target.value)} className={`border rounded-lg px-3 py-2 text-sm outline-none ${darkMode ? 'bg-[#111c44] border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none`} placeholder="11 dígitos" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Categoria CNH *</label>
                    <select value={categoriaCnh} onChange={(e) => setCategoriaCnh(e.target.value)} className={`border rounded-lg px-3 py-2 text-sm outline-none ${darkMode ? 'bg-[#111c44] border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none`}>
                      <option value="">Selecione...</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                      <option value="AB">AB</option>
                      <option value="AC">AC</option>
                      <option value="AD">AD</option>
                      <option value="AE">AE</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Data de Emissão CNH *</label>
                    <input type="text" value={dataEmissaoCnh} onChange={(e) => setDataEmissaoCnh(formatarData(e.target.value))} className={`border rounded-lg px-3 py-2 text-sm outline-none ${darkMode ? 'bg-[#111c44] border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none`} placeholder="DD/MM/AAAA" maxLength={10} />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SEÇÃO 2: CONTATO E ENDEREÇO */}
          <section className="space-y-4 print:break-inside-avoid">
            <h3 className={`text-sm font-black uppercase tracking-wider pb-2 border-b flex items-center gap-2 ${darkMode ? 'text-[#00ff87] border-slate-800' : 'text-[#046c3b] border-slate-100'} print:text-black print:border-black`}>
              <span>📍</span> 2. Contato e Endereço Residencial
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">CEP *</label>
                <input type="text" value={cep} onChange={(e) => setCep(formatarCEP(e.target.value))} onBlur={handleCepBlur} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="00000-000" />
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Rua / Avenida *</label>
                <input type="text" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="Endereço Completo" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5 col-span-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Número *</label>
                <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="Nº" />
              </div>
              <div className="flex flex-col gap-1.5 col-span-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Complemento</label>
                <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="Apto, Bloco..." />
              </div>
              <div className="flex flex-col gap-1.5 col-span-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Bairro *</label>
                <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="Bairro" />
              </div>
              <div className="flex flex-col gap-1.5 col-span-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Cidade / UF *</label>
                <div className="flex gap-1">
                  <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} className={`w-full border rounded-xl px-2 py-2.5 text-sm outline-none ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="Cidade" />
                  <input type="text" value={uf} onChange={(e) => setUf(e.target.value)} className={`w-12 border border-slate-200 rounded-xl px-1 py-2.5 text-sm text-center uppercase outline-none ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="UF" maxLength={2} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">E-mail Principal *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="exemplo@email.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Celular / WhatsApp *</label>
                <input type="text" value={telefone} onChange={(e) => setTelefone(formatarTelefone(e.target.value))} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="(00) 00000-0000" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Telefone p/ Recado (Opcional)</label>
                <input type="text" value={telefoneRecado} onChange={(e) => setTelefoneRecado(formatarTelefone(e.target.value))} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${darkMode ? 'bg-[#0f172a]/60 border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none print:p-0 print:font-bold`} placeholder="(00) 00000-0000" />
              </div>
            </div>
          </section>

          {/* SEÇÃO 3: FILHOS E DEPENDENTES */}
          <section className="space-y-4 print:break-inside-avoid">
            <h3 className={`text-sm font-black uppercase tracking-wider pb-2 border-b flex items-center gap-2 ${darkMode ? 'text-[#00ff87] border-slate-800' : 'text-[#046c3b] border-slate-100'} print:text-black print:border-black`}>
              <span>👨‍👩‍👧‍👦</span> 3. Filhos e Dependentes
            </h3>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Possui filhos menores de 14 anos ou dependentes legais? *</label>
              <div className="flex gap-3 print:hidden">
                <button type="button" onClick={() => setHasDependents(true)} className={`rounded-xl px-5 py-2 text-xs font-bold border transition-all ${hasDependents === true ? 'bg-[#046c3b] border-[#00ff87] text-white shadow-[0_0_10px_rgba(0,255,135,0.2)]' : darkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>Sim</button>
                <button type="button" onClick={() => { setHasDependents(false); setQuerSalarioFamilia(null); setDependentes([]); }} className={`rounded-xl px-5 py-2 text-xs font-bold border transition-all ${hasDependents === false ? 'bg-gradient-to-r from-red-950 to-red-900 border-red-500 text-red-200' : darkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>Não</button>
              </div>
            </div>

            {hasDependents && (
              <div className={`space-y-4 p-4 border border-dashed rounded-xl animate-fadeIn print:p-0 print:border-none ${darkMode ? 'bg-[#1c2754]/10 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Deseja requerer o benefício do Salário-Família? *</label>
                  <div className="flex gap-3 print:hidden">
                    <button type="button" onClick={() => setQuerSalarioFamilia(true)} className={`rounded-xl px-5 py-1.5 text-xs font-bold border transition-all ${querSalarioFamilia === true ? 'bg-[#046c3b] border-[#00ff87] text-white' : darkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>Sim</button>
                    <button type="button" onClick={() => setQuerSalarioFamilia(false)} className={`rounded-xl px-5 py-1.5 text-xs font-bold border transition-all ${querSalarioFamilia === false ? 'bg-gradient-to-r from-red-950 to-red-900 border-red-500 text-red-200' : darkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>Não</button>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Lista de Dependentes / Filhos</span>
                  {dependentes.map((dep, idx) => (
                    <div key={idx} className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 border rounded-xl print:p-0 print:border-0 ${darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                      <input type="text" placeholder="Nome Completo do Filho" value={dep.nome} onChange={(e) => { const n = [...dependentes]; n[idx].nome = e.target.value; setDependentes(n); }} className={`border rounded-lg px-3 py-1.5 text-sm uppercase outline-none ${darkMode ? 'bg-[#111c44] border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none`} />
                      <input type="text" placeholder="CPF do Filho" value={dep.cpf} onChange={(e) => { const n = [...dependentes]; n[idx].cpf = formatarCPF(e.target.value); setDependentes(n); }} className={`border rounded-lg px-3 py-1.5 text-sm outline-none ${darkMode ? 'bg-[#111c44] border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none`} />
                      <input type="text" placeholder="Nascimento (DD/MM/AAAA)" value={dep.nascimento} onChange={(e) => { const n = [...dependentes]; n[idx].nascimento = formatarData(e.target.value); setDependentes(n); }} className={`border rounded-lg px-3 py-1.5 text-sm outline-none ${darkMode ? 'bg-[#111c44] border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none`} maxLength={10} />
                    </div>
                  ))}
                  <button type="button" onClick={addDependente} className={`text-xs font-bold hover:underline print:hidden ${darkMode ? 'text-[#00ff87]' : 'text-[#046c3b]'}`}>+ Adicionar Filho/Dependente</button>
                </div>
              </div>
            )}
          </section>

          {/* SEÇÃO 4: DADOS BANCÁRIOS */}
          <section className="space-y-4 print:break-inside-avoid">
            <h3 className={`text-sm font-black uppercase tracking-wider pb-2 border-b flex items-center gap-2 ${darkMode ? 'text-[#00ff87] border-slate-800' : 'text-[#046c3b] border-slate-100'} print:text-black print:border-black`}>
              <span>💳</span> 4. Dados Bancários
            </h3>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Possui conta corrente ativa junto ao Banco Itaú? *</label>
              <div className="flex gap-3 print:hidden">
                <button type="button" onClick={() => setHasItau(true)} className={`rounded-xl px-5 py-2 text-xs font-bold border transition-all ${hasItau === true ? 'bg-[#046c3b] border-[#00ff87] text-white shadow-[0_0_10px_rgba(0,255,135,0.2)]' : darkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>Sim</button>
                <button type="button" onClick={() => { setHasItau(false); setAgencia(''); setContaCorrente(''); }} className={`rounded-xl px-5 py-2 text-xs font-bold border transition-all ${hasItau === false ? 'bg-gradient-to-r from-red-950 to-red-900 border-red-500 text-red-200' : darkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>Não</button>
              </div>
            </div>

            {hasItau && (
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-dashed rounded-xl animate-fadeIn print:p-0 print:border-none ${darkMode ? 'bg-[#1c2754]/10 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Agência Itaú *</label>
                  <input type="text" value={agencia} onChange={(e) => setAgencia(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${darkMode ? 'bg-[#111c44] border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none`} placeholder="Número da agência" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Conta Corrente (com dígito) *</label>
                  <input type="text" value={contaCorrente} onChange={(e) => setContaCorrente(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${darkMode ? 'bg-[#111c44] border-slate-800 text-white focus:border-[#00ff87]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#046c3b]'} print:border-none`} placeholder="Número da conta" />
                </div>
              </div>
            )}
          </section>

          {/* SEÇÃO 5: BENEFÍCIOS */}
          <section className="space-y-4 print:break-inside-avoid">
            <h3 className={`text-sm font-black uppercase tracking-wider pb-2 border-b flex items-center gap-2 ${darkMode ? 'text-[#00ff87] border-slate-800' : 'text-[#046c3b] border-slate-100'} print:text-black print:border-black`}>
              <span>🚌</span> 5. Opção de Benefícios
            </h3>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Deseja solicitar o benefício do Vale Transporte? *</label>
              <div className="flex gap-3 print:hidden">
                <button type="button" onClick={() => setQuerVt(true)} className={`rounded-xl px-5 py-2 text-xs font-bold border transition-all ${querVt === true ? 'bg-[#046c3b] border-[#00ff87] text-white shadow-[0_0_10px_rgba(0,255,135,0.2)]' : darkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>Sim, desejo</button>
                <button type="button" onClick={() => { setQuerVt(false); setQtdIda(''); setQtdVinda(''); setValorPassagem(''); }} className={`rounded-xl px-5 py-2 text-xs font-bold border transition-all ${querVt === false ? 'bg-gradient-to-r from-red-950 to-red-900 border-red-500 text-red-200' : darkMode ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>Não, declino</button>
              </div>
            </div>

            {querVt && (
              <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-dashed rounded-xl animate-fadeIn print:p-0 print:border-none ${darkMode ? 'bg-[#1c2754]/10 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Qtd Passagens (Ida) *</label>
                  <input type="number" value={qtdIda} onChange={(e) => setQtdIda(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${darkMode ? 'bg-[#111c44] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'} print:border-none`} placeholder="Ida" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Qtd Passagens (Volta) *</label>
                  <input type="number" value={qtdVinda} onChange={(e) => setQtdVinda(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${darkMode ? 'bg-[#111c44] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'} print:border-none`} placeholder="Volta" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Valor de cada Tarifa (R$) *</label>
                  <input type="text" value={valorPassagem} onChange={(e) => setValorPassagem(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${darkMode ? 'bg-[#111c44] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'} print:border-none`} placeholder="Ex: 5.00" />
                </div>
              </div>
            )}
          </section>

          {/* CHECKLIST DINÂMICO DE DOCUMENTOS */}
          <section className={`border rounded-2xl p-6 space-y-4 transition-all ${
            darkMode ? 'bg-[#111c44]/30 border-slate-800/60' : 'bg-slate-50 border-slate-200'
          } print:bg-white print:border-black print:p-5`}>
            <div>
              <h3 className={`text-sm font-black uppercase tracking-wider ${darkMode ? 'text-[#00ff87]' : 'text-slate-700'} print:text-black`}>📋 Checklist de Documentos Cadastrais</h3>
              <p className="text-slate-400 text-xs mt-0.5 print:text-slate-600">Documentos brutos necessários para enviar por e-mail ao gestor após a impressão:</p>
            </div>

            <ul className={`text-xs space-y-2.5 list-none pl-0 ${darkMode ? 'text-slate-300' : 'text-slate-600'} print:text-black`}>
              <li className="flex items-start gap-2">
                <span className="text-[#00ff87] font-bold">✓</span>
                <span><strong>Carteira de Trabalho (CTPS Digital):</strong> Apenas para conferência cadastral. Não envie o documento físico.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00ff87] font-bold">✓</span>
                <span><strong>Carteira de Identidade (RG / CNI):</strong> Cópia nítida contendo órgão emissor, local e data de expedição perfeitamente legíveis.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00ff87] font-bold">✓</span>
                <span><strong>Certidão Civil:</strong> Cópia da sua Certidão de Nascimento ou Casamento.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00ff87] font-bold">✓</span>
                <span><strong>Comprovante de Residência (Cópia):</strong> Emitido há no máximo 3 meses.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00ff87] font-bold">✓</span>
                <span><strong>Comprovante de Escolaridade (Cópia):</strong> Histórico ou diploma correspondente ao grau informado.</span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-[#00ff87] font-bold">✓</span>
                {hasItau === false ? (
                  <span className="text-amber-500 font-medium"><strong>Conta Corrente:</strong> A empresa fornecerá a carta de encaminhamento oficial para abertura de conta salário Itaú.</span>
                ) : (
                  <span><strong>Dados Bancários (Cópia):</strong> Comprovante legível da agência e conta corrente do Itaú.</span>
                )}
              </li>

              {querVt && (
                <li className="flex items-start gap-2 font-medium">
                  <span className="text-[#00ff87] font-bold">✓</span>
                  <span><strong>Benefícios:</strong> Formulário impresso de Vale Transporte (VT).</span>
                </li>
              )}

              {sexo.toLowerCase() === 'masculino' && temReservista && (
                <li className="flex items-start gap-2 font-medium">
                  <span className="text-[#00ff87] font-bold">✓</span>
                  <span><strong>Documentação Militar:</strong> Cópia legível do Certificado de Reservista ou Dispensa Incorporada.</span>
                </li>
              )}

              {hasDependents && (
                <>
                  <li className="flex items-start gap-2 font-medium text-indigo-400 print:text-black">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>CPF dos Dependentes:</strong> Cópia legível obrigatória de todos os dependentes informados.</span>
                  </li>
                  <li className="flex items-start gap-2 font-medium text-indigo-400 print:text-black">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Certidão dos Filhos:</strong> Cópia da Certidão de Nascimento de filhos com até 14 anos.</span>
                  </li>
                </>
              )}

              {hasDependents && querSalarioFamilia && (
                <>
                  <li className="flex items-start gap-2 font-medium text-purple-400 print:text-black">
                    <span className="text-purple-500 font-bold">✓</span>
                    <span><strong>Carteira de Vacinação:</strong> Cópia das vacinas obrigatórias para filhos com até 6 anos.</span>
                  </li>
                  <li className="flex items-start gap-2 font-medium text-purple-400 print:text-black">
                    <span className="text-purple-500 font-bold">✓</span>
                    <span><strong>Frequência Escolar:</strong> Declaração escolar atualizada para filhos de até 14 anos.</span>
                  </li>
                </>
              )}

              {isMotorista && (
                <>
                  <li className="flex items-start gap-2 font-medium text-blue-400 print:text-black">
                    <span className="text-blue-500 font-bold">✓</span>
                    <span><strong>Habilitação Profissional:</strong> Cópia da CNH dentro do prazo de validade.</span>
                  </li>
                  <li className="flex items-start gap-2 font-medium text-blue-400 print:text-black">
                    <span className="text-blue-500 font-bold">✓</span>
                    <span><strong>Certidão do DETRAN:</strong> Cópia impressa do "Nada Consta" de pontuações.</span>
                  </li>
                </>
              )}
            </ul>
          </section>

          {/* Área de Assinaturas (Impressão) */}
          <section className="hidden print:block pt-16 break-inside-avoid">
            <div className="flex justify-between items-center gap-10">
              <div className="w-1/2 text-center border-t border-black pt-2 text-xs font-bold">
                Assinatura do Colaborador: {nomeCompleto || '__________________________________'}
              </div>
              <div className="w-1/2 text-center border-t border-black pt-2 text-xs font-bold">
                Departamento Pessoal
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer Fixo (Tela) */}
      <footer className={`border-t p-6 flex justify-center sticky bottom-0 backdrop-blur-md transition-colors ${
        darkMode ? 'bg-[#0b132b]/90 border-slate-800' : 'bg-white/90 border-slate-100 shadow-md'
      } print:hidden`}>
        <button 
          type="button" 
          onClick={handleGerarPDF} 
          className={`font-black text-sm px-12 py-4 rounded-xl shadow-lg transition-all active:scale-[0.985] cursor-pointer ${
            darkMode 
              ? 'bg-gradient-to-r from-[#046c3b] to-[#00ff87] text-white shadow-[0_0_20px_rgba(0,255,135,0.2)] hover:brightness-110' 
              : 'bg-[#046c3b] hover:bg-[#03522c] text-white'
          }`}
        >
          🖨️ Validar Dados e Imprimir Ficha
        </button>
      </footer>

    </div>
  );
}
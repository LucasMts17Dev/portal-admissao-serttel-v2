import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

function getChaves(): string[] {
  const chaves: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const chave = process.env[`GEMINI_API_KEY_${i}`];
    if (chave) chaves.push(chave);
  }
  if (process.env.GEMINI_API_KEY) chaves.push(process.env.GEMINI_API_KEY);
  return chaves;
}

export async function POST(req: NextRequest) {
  const chaves = getChaves();

  if (chaves.length === 0) {
    return NextResponse.json(
      { erro: 'Nenhuma chave de API configurada no servidor.' },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { partes } = body as { partes: any[] };

  if (!partes || partes.length === 0) {
    return NextResponse.json({ erro: 'Nenhum documento recebido.' }, { status: 400 });
  }

  let ultimoErro: any = null;

  for (const chave of chaves) {
    try {
      const ai = new GoogleGenerativeAI(chave);
      const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const resultado = await model.generateContent(partes);
      const texto = resultado.response.text();

      return NextResponse.json({ texto });
    } catch (error: any) {
      ultimoErro = error;
      const msg: string = error?.message ?? '';

      if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many Requests')) {
        console.warn('Chave com cota esgotada, tentando próxima...');
        continue;
      }

      break;
    }
  }

  const msg: string = ultimoErro?.message ?? 'Erro interno ao processar os documentos.';
  const todasCotasEsgotadas =
    msg.includes('429') || msg.includes('quota') || msg.includes('Too Many Requests');

  return NextResponse.json(
    {
      erro: todasCotasEsgotadas
        ? '❌ Todas as chaves atingiram o limite diário. Tente novamente amanhã ou adicione mais chaves no .env.local.'
        : msg,
    },
    { status: 500 }
  );
}
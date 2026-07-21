import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest) {
  // Validar sessão
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ erro: 'Acesso negado.' }, { status: 403 });
  }

  try {
    // Placeholder - Futuro: retornar informações do DP
    return NextResponse.json({
      ok: true,
      data: {
        status: 'Estrutura DP - FASE 1',
        recebimentoAtivo: false,
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar info DP:', error);
    return NextResponse.json(
      { erro: error.message || 'Erro ao processar' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Validar sessão
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ erro: 'Acesso negado.' }, { status: 403 });
  }

  try {
    // Placeholder - Futuro: processar dados do DP
    const body = await req.json();

    return NextResponse.json({
      ok: true,
      data: {
        mensagem: 'DP - FASE 1 - Estrutura criada com sucesso',
      },
    });
  } catch (error: any) {
    console.error('Erro ao processar DP:', error);
    return NextResponse.json(
      { erro: error.message || 'Erro ao processar' },
      { status: 500 }
    );
  }
}

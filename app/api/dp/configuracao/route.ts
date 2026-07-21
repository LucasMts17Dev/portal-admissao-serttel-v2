import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!;

// ─── Tipo de Configuração ─────────────────────────────────────────────────────

interface Configuracao {
  dias_mes: number[];
  hora_inicio: string;
  hora_fim: string;
  ativo: boolean;
}

// ─── GET: Buscar configuração existente ────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ erro: 'Não autenticado', status: 401 }, { status: 401 });
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/dp_configuracao?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    const data = await response.json();

    // Se não existir configuração, retorna padrão
    if (!Array.isArray(data) || data.length === 0) {
      const configPadrao: Configuracao = {
        dias_mes: [],
        hora_inicio: '09:00',
        hora_fim: '17:00',
        ativo: true,
      };
      return NextResponse.json({ ok: true, data: configPadrao }, { status: 200 });
    }

    return NextResponse.json({ ok: true, data: data[0] }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    return NextResponse.json(
      { erro: 'Erro ao buscar configuração', status: 500 },
      { status: 500 }
    );
  }
}

// ─── POST: Salvar configuração ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ erro: 'Não autenticado', status: 401 }, { status: 401 });
    }

    const body = await req.json();
    const config: Configuracao = {
      dias_mes: Array.isArray(body.dias_mes) ? body.dias_mes : [],
      hora_inicio: body.hora_inicio ?? '09:00',
      hora_fim: body.hora_fim ?? '17:00',
      ativo: body.ativo ?? true,
    };

    // Validar horários
    if (!/^\d{2}:\d{2}$/.test(config.hora_inicio)) {
      return NextResponse.json(
        { erro: 'Horário inicial inválido. Use formato HH:MM', status: 400 },
        { status: 400 }
      );
    }

    if (!/^\d{2}:\d{2}$/.test(config.hora_fim)) {
      return NextResponse.json(
        { erro: 'Horário final inválido. Use formato HH:MM', status: 400 },
        { status: 400 }
      );
    }

    // Validar dias (1-31)
    if (!Array.isArray(config.dias_mes) || config.dias_mes.some(d => d < 1 || d > 31)) {
      return NextResponse.json(
        { erro: 'Dias do mês devem estar entre 1 e 31', status: 400 },
        { status: 400 }
      );
    }

    // Verificar se já existe configuração
    const existente = await fetch(`${SUPABASE_URL}/rest/v1/dp_configuracao?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    const dataExistente = await existente.json();
    const jaExiste = Array.isArray(dataExistente) && dataExistente.length > 0;

    let response;

    if (jaExiste) {
      // UPDATE
      response = await fetch(
        `${SUPABASE_URL}/rest/v1/dp_configuracao?id=eq.${dataExistente[0].id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: 'return=representation',
          },
          body: JSON.stringify({
            ...config,
            atualizado_em: new Date().toISOString(),
          }),
        }
      );
    } else {
      // INSERT
      response = await fetch(`${SUPABASE_URL}/rest/v1/dp_configuracao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          ...config,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
        }),
      });
    }

    const result = await response.json();

    if (!response.ok) {
      console.error('Erro Supabase:', result);
      return NextResponse.json(
        { erro: 'Erro ao salvar configuração', status: 500 },
        { status: 500 }
      );
    }

    const dados = Array.isArray(result) ? result[0] : result;

    return NextResponse.json({ ok: true, data: dados }, { status: 200 });
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    return NextResponse.json(
      { erro: 'Erro ao salvar configuração', status: 500 },
      { status: 500 }
    );
  }
}

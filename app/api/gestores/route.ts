import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Só o DP (admin) pode criar gestores
  const session = await getServerSession();
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ erro: 'Acesso negado.' }, { status: 403 });
  }

  const { nome, email, senha, filial } = await req.json();

  if (!nome || !email || !senha || !filial) {
    return NextResponse.json({ erro: 'Preencha todos os campos.' }, { status: 400 });
  }

  const senha_hash = await bcrypt.hash(senha, 12);

  const { data, error } = await supabase
    .from('usuarios')
    .insert({
      nome,
      email,
      senha_hash,
      filial,
      role: 'gestor',
      criado_por: session.user?.email,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ erro: 'E-mail já cadastrado.' }, { status: 409 });
    }
    return NextResponse.json({ erro: 'Erro ao criar gestor.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, gestor: { id: data.id, nome: data.nome, email: data.email, filial: data.filial } });
}
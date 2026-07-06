import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        senha: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 Tentativa de login:', credentials?.email);

        if (!credentials?.email || !credentials?.senha) return null;

        console.log('📡 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: usuario, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', credentials.email)
          .eq('ativo', true)
          .single();

        console.log('👤 Usuário encontrado:', usuario?.email, '| Erro:', error?.message);

        if (error || !usuario) return null;

        const senhaCorreta = await bcrypt.compare(credentials.senha, usuario.senha_hash);
        console.log('🔑 Senha correta:', senhaCorreta);

        if (!senhaCorreta) return null;

        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
          role: usuario.role,
          filial: usuario.filial,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.filial = (user as any).filial;
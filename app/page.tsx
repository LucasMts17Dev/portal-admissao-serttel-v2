import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Portal Serttel
        </h1>
        <p className="text-gray-600 mb-10">
          Selecione como deseja acessar
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <Link
            href="/admissao"
            className="rounded-xl border border-gray-200 bg-white p-8 hover:shadow-lg hover:border-blue-400 transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sou Candidato
            </h2>
            <p className="text-sm text-gray-500">
              Preencher formulário de admissão
            </p>
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-gray-200 bg-white p-8 hover:shadow-lg hover:border-blue-400 transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sou Gestor
            </h2>
            <p className="text-sm text-gray-500">
              Acessar módulo de auditoria
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
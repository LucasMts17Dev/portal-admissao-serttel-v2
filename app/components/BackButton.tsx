'use client';
import Link from "next/link";

export default function BackButton() {
  return (
    <Link
      href="/"
      className="fixed top-5 left-5 z-50 inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#00ff87] transition-colors print:hidden"
    >
      ← Voltar ao início
    </Link>
  );
}
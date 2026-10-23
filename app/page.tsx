import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, FolderHeart, Search, ShieldCheck } from "lucide-react";

const features = [
  { icon: FolderHeart, title: "Cada momento no seu lugar", description: "Reúna fotos, vídeos e documentos em coleções que acompanham a sua rotina." },
  { icon: Search, title: "Reencontre o que importa", description: "Pesquise, filtre, favorite e compare suas memórias sem perder o contexto." },
  { icon: ShieldCheck, title: "Um espaço só seu", description: "Acesse sua biblioteca com login e organize seus registros neste dispositivo." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3 focus:text-slate-950">Pular para o conteúdo</a>
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-7 lg:px-12">
        <Link href="/" aria-label="JOVI início" className="flex items-center gap-3"><span className="rounded-full bg-blue-600 p-2.5"><Camera size={24} /></span><span className="text-xl font-extrabold">JOVI<span className="block text-[10px] font-medium tracking-widest text-slate-400">POR HUMANLY</span></span></Link>
        <nav aria-label="Navegação pública" className="flex items-center gap-5 text-sm"><a href="#como-funciona" className="hidden text-slate-300 hover:text-white sm:inline">Como funciona</a><Link href="/login" className="rounded-lg border border-slate-600 px-5 py-2.5 font-semibold hover:border-cyan-300">Entrar</Link></nav>
      </header>
      <main id="conteudo">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-12 md:grid-cols-2 lg:gap-20 lg:px-12 lg:pb-28 lg:pt-20">
          <div>
            <p className="mb-6 text-xs font-bold tracking-[0.2em] text-cyan-300">SUA ROTINA MERECE SER LEMBRADA</p>
            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">Pequenos momentos.<br /><span className="text-cyan-300">Grandes memórias.</span></h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-slate-300">Da aula ao campus, do treino ao fim do dia. A biblioteca JOVI conecta os registros da sua vida em um espaço simples de organizar e fácil de revisitar.</p>
            <Link href="/login" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500">Explorar minha biblioteca<ArrowRight size={19} /></Link>
            <p className="mt-4 text-xs text-slate-400">Experimente com a conta de demonstração.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[{ file: "aula", label: "Aprender", offset: false }, { file: "campus", label: "Conectar", offset: true }, { file: "treino", label: "Movimentar", offset: false }, { file: "casa", label: "Desacelerar", offset: true }].map(({ file, label, offset }) => (
              <figure key={file} className={`relative aspect-[4/5] overflow-hidden rounded-2xl ${offset ? "translate-y-6" : ""}`}>
                <Image src={`/jovi/mode-${file}.webp`} alt={`Momentos para ${label.toLowerCase()} na experiência JOVI`} fill sizes="(max-width: 767px) 45vw, 24vw" className="object-cover" priority={file === "aula"} />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-4 pt-12 text-sm font-semibold">{label}</figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section id="como-funciona" className="border-y border-slate-800 bg-slate-900/50 px-6 py-20 lg:px-12">
          <div className="mx-auto max-w-6xl"><p className="text-xs font-bold tracking-widest text-cyan-300">DO REGISTRO À MEMÓRIA</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Mais presença. Menos procura.</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">{features.map(({ icon: Icon, title, description }) => <article key={title} className="rounded-xl border border-slate-700 bg-slate-900 p-7"><Icon size={27} className="text-cyan-300" /><h3 className="mt-6 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-300">{description}</p></article>)}</div>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-6 py-20 text-center"><h2 className="text-3xl font-semibold">A sua história continua aqui.</h2><p className="mt-4 leading-relaxed text-slate-300">Uma solução da equipe Humanly para o Challenge JOVI, evoluindo a biblioteca de momentos da Sprint 3.</p><Link href="/login" className="mt-7 inline-flex items-center gap-2 font-bold text-cyan-300 hover:text-white">Começar a organizar<ArrowRight size={18} /></Link></section>
      </main>
      <footer className="border-t border-slate-800 px-6 py-7 text-center text-xs text-slate-400">© 2026 Humanly × JOVI · Projeto acadêmico FIAP · Sprint 4</footer>
    </div>
  );
}

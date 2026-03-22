import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1816] border-t border-[#2e2c2a]">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-white">智遊工作室</span>
            <span className="hidden md:block text-[#3c3a38]">|</span>
            <span className="text-xs text-[#5c5a58]">讓工作更輕鬆，讓生活更自由</span>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link href="/#services" className="text-xs text-[#5c5a58] hover:text-white transition-colors">服務項目</Link>
            <Link href="/#clients" className="text-xs text-[#5c5a58] hover:text-white transition-colors">適合對象</Link>
            <Link href="/#portfolio" className="text-xs text-[#5c5a58] hover:text-white transition-colors">作品案例</Link>
            <Link href="/#contact" className="text-xs text-[#5c5a58] hover:text-white transition-colors">聯絡我們</Link>
            <Link href="https://lin.ee/N4ukE55" target="_blank" className="text-xs text-[#e8602c] hover:text-[#f07040] transition-colors">LINE 好友</Link>
          </div>

          <p className="text-xs text-[#3c3a38]">&copy; {currentYear} 智遊工作室</p>
        </div>
      </div>
    </footer>
  );
}

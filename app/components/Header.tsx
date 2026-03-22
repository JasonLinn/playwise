"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';
import { Disclosure } from '@headlessui/react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#faf9f6] border-b border-[#e8e4df]">
      <div className="container-custom py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-[#1a1816] tracking-tight">
            智遊工作室
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="text-sm text-[#5c5a58] hover:text-[#1a1816] transition-colors">
              服務項目
            </Link>
            <Link href="/#clients" className="text-sm text-[#5c5a58] hover:text-[#1a1816] transition-colors">
              適合對象
            </Link>
            <Link href="/#portfolio" className="text-sm text-[#5c5a58] hover:text-[#1a1816] transition-colors">
              作品案例
            </Link>
            <Link href="/#contact" className="text-sm text-[#5c5a58] hover:text-[#1a1816] transition-colors">
              聯絡我們
            </Link>
          </div>

          <div className="hidden md:block">
            <Link href="https://lin.ee/N4ukE55" target="_blank" className="btn-primary text-sm py-2 px-5">
              LINE 諮詢
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#1a1816] focus:outline-none"
            >
              {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <Disclosure>
          <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} pt-4 pb-3 border-t border-[#e8e4df] mt-3`}>
            <div className="flex flex-col gap-4">
              <Link href="/#services" className="text-sm text-[#5c5a58]" onClick={() => setIsOpen(false)}>服務項目</Link>
              <Link href="/#clients" className="text-sm text-[#5c5a58]" onClick={() => setIsOpen(false)}>適合對象</Link>
              <Link href="/#portfolio" className="text-sm text-[#5c5a58]" onClick={() => setIsOpen(false)}>作品案例</Link>
              <Link href="/#contact" className="text-sm text-[#5c5a58]" onClick={() => setIsOpen(false)}>聯絡我們</Link>
              <Link href="https://lin.ee/N4ukE55" target="_blank" className="btn-primary w-full text-center" onClick={() => setIsOpen(false)}>
                LINE 諮詢
              </Link>
            </div>
          </div>
        </Disclosure>
      </div>
    </header>
  );
}

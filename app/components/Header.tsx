"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';
import { Disclosure } from '@headlessui/react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-[rgb(var(--primary-color))]">
              智遊工作室
            </Link>
          </div>

          {/* 桌面選單 */}
          <div className="hidden md:flex space-x-8">
            <Link href="/#services" className="text-gray-700 hover:text-[rgb(var(--primary-color))]">
              服務項目
            </Link>
            <Link href="/#clients" className="text-gray-700 hover:text-[rgb(var(--primary-color))]">
              適合對象
            </Link>
            <Link href="/#testimonials" className="text-gray-700 hover:text-[rgb(var(--primary-color))]">
              客戶評價
            </Link>
            <Link href="/#contact" className="text-gray-700 hover:text-[rgb(var(--primary-color))]">
              聯絡我們
            </Link>
          </div>

          <div className="hidden md:block">
            <Link href="https://lin.ee/N4ukE55" target="_blank" className="btn-primary">
              LINE 諮詢
            </Link>
          </div>

          {/* 行動裝置選單按鈕 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        {/* 行動裝置選單 */}
        <Disclosure>
          <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} pt-4 pb-2`}>
            <div className="flex flex-col space-y-4">
              <Link 
                href="/#services" 
                className="text-gray-700 hover:text-[rgb(var(--primary-color))]"
                onClick={() => setIsOpen(false)}
              >
                服務項目
              </Link>
              <Link 
                href="/#clients" 
                className="text-gray-700 hover:text-[rgb(var(--primary-color))]"
                onClick={() => setIsOpen(false)}
              >
                適合對象
              </Link>
              <Link 
                href="/#testimonials" 
                className="text-gray-700 hover:text-[rgb(var(--primary-color))]"
                onClick={() => setIsOpen(false)}
              >
                客戶評價
              </Link>
              <Link 
                href="/#contact" 
                className="text-gray-700 hover:text-[rgb(var(--primary-color))]"
                onClick={() => setIsOpen(false)}
              >
                聯絡我們
              </Link>
              <Link 
                href="https://lin.ee/N4ukE55" 
                target="_blank" 
                className="btn-primary w-full text-center"
                onClick={() => setIsOpen(false)}
              >
                LINE 諮詢
              </Link>
            </div>
          </div>
        </Disclosure>
      </div>
    </header>
  );
} 
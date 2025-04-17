import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "智遊工作室 | LINE 好友",
  description: "掃描 QR 碼加入智遊工作室的 LINE 好友，獲取更多服務資訊。",
};

export default function LinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">智遊工作室</h1>
        <p className="text-gray-600 mb-6">掃描下方 QR 碼加入我們的 LINE 好友</p>
        
        <div className="relative w-64 h-64 mx-auto mb-6">
          <Image 
            src="/line-qr-real.png" 
            alt="LINE QR 碼" 
            fill
            sizes="100%"
            className="object-contain"
          />
        </div>
        
        <div className="mb-6">
          <a 
            href="https://lin.ee/N4ukE55" 
            target="_blank" 
            className="inline-block bg-[#06C755] hover:bg-[#05b64c] text-white py-3 px-6 rounded-md transition-colors"
          >
            點擊加入 LINE 好友
          </a>
        </div>
        
        <Link 
          href="/" 
          className="text-[rgb(var(--primary-color))] hover:underline"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
} 
import Link from 'next/link';
import { FiMail, FiMessageSquare, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">智遊工作室</h3>
            <p className="text-gray-300 mb-4">
              讓工作更輕鬆，讓生活更自由
            </p>
            <div className="flex space-x-4">
              <Link href="https://lin.ee/N4ukE55" target="_blank" className="text-white hover:text-[rgb(var(--secondary-color))]">
                <FiMessageSquare className="h-6 w-6" />
              </Link>
              <Link href="mailto:contact@playwise.studio" className="text-white hover:text-[rgb(var(--secondary-color))]">
                <FiMail className="h-6 w-6" />
              </Link>
              <Link href="tel:0928836163" className="text-white hover:text-[rgb(var(--secondary-color))]">
                <FiPhone className="h-6 w-6" />
              </Link>
              <Link href="https://maps.app.goo.gl/V3uCz1jLPCUB6L4L7" target="_blank" className="text-white hover:text-[rgb(var(--secondary-color))]">
                <FiMapPin className="h-6 w-6" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">快速連結</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#services" className="text-gray-300 hover:text-white">
                  服務項目
                </Link>
              </li>
              <li>
                <Link href="/#clients" className="text-gray-300 hover:text-white">
                  適合對象
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-gray-300 hover:text-white">
                  客戶評價
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-300 hover:text-white">
                  聯絡我們
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">聯絡我們</h3>
            <div className="text-gray-300 space-y-2 mb-4">
              <p>
                電話：<a href="tel:0928836163" className="hover:text-white">0928-836-163</a>
              </p>
              <p>
                地址：<a href="https://maps.app.goo.gl/V3uCz1jLPCUB6L4L7" target="_blank" className="hover:text-white">宜蘭縣冬山鄉武淵三路120號</a>
              </p>
            </div>
            <Link 
              href="https://lin.ee/N4ukE55" 
              target="_blank" 
              className="inline-block bg-[rgb(var(--secondary-color))] text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
            >
              加入 LINE 好友
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} 智遊工作室. 保留所有權利。</p>
        </div>
      </div>
    </footer>
  );
} 
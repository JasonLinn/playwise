import Link from 'next/link';
import Image from 'next/image';
import { FiPhone, FiMapPin } from 'react-icons/fi';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20">
      <div className="container-custom">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 md:p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">想知道我們能怎麼幫你？</h2>
              <p className="text-lg text-gray-600 mb-4">
                每個品牌、每位工作者的需求都不同，我們希望能了解你的情況，提供最適合你的解決方案。歡迎加入我們的 LINE，一起聊聊！
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <FiPhone className="mr-2" />
                  <span>電話：</span>
                  <a href="tel:0928836163" className="text-[rgb(var(--primary-color))] hover:underline ml-1">
                    0928-836-163
                  </a>
                </div>
                <div className="flex items-center text-gray-700">
                  <FiMapPin className="mr-2" />
                  <span>地址：</span>
                  <a href="https://maps.app.goo.gl/V3uCz1jLPCUB6L4L7" target="_blank" className="text-[rgb(var(--primary-color))] hover:underline ml-1">
                    宜蘭縣冬山鄉武淵三路120號
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <Link 
                  href="https://lin.ee/N4ukE55" 
                  target="_blank" 
                  className="btn-primary flex items-center justify-center w-full md:w-auto"
                >
                  <span className="mr-2">加入 LINE 好友</span>
                </Link>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-10 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-md bg-white shadow-lg p-4 flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <Image 
                        src="/line-qr.png" 
                        alt="LINE QR 碼" 
                        fill
                        sizes="100%"
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
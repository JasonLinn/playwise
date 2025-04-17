import { FiRepeat, FiMessageSquare, FiSettings } from 'react-icons/fi';

export default function ServicesSection() {
  const services = [
    {
      icon: <FiRepeat className="h-8 w-8" />,
      title: "自動處理繁瑣的小事",
      description: "每天都在重複做一樣的事？我們幫你設定好流程，讓事情「自己動起來」，你可以把時間花在更重要的事上。",
      examples: [
        "表單送出後自動寄信通知",
        "每天自動整理客戶名單或訂單資料",
        "幫你固定時間發訊息、做提醒"
      ]
    },
    {
      icon: <FiMessageSquare className="h-8 w-8" />,
      title: "設計聰明的客服小幫手",
      description: "想讓你的 Line 或網站有個會聊天、會處理問題的小助理嗎？我們幫你打造一個懂你品牌風格的智能管家，客人一問就答，還能引導他完成預約、報名或查詢資訊。",
      examples: []
    },
    {
      icon: <FiSettings className="h-8 w-8" />,
      title: "一對一規劃最適合你的工作模式",
      description: "不確定從哪裡開始？也沒關係，我們可以陪你聊聊目前遇到的問題，一起找出最簡單又有效的解法，讓你事半功倍。",
      examples: []
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">我們可以幫你做什麼？</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            讓繁瑣的流程自動化，專注在真正重要的業務上
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-[rgb(var(--primary-color))] mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              
              {service.examples.length > 0 && (
                <ul className="text-gray-700 space-y-2">
                  {service.examples.map((example, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-2 text-[rgb(var(--secondary-color))]">•</span>
                      {example}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
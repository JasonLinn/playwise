import { FiHome, FiUser, FiUsers } from 'react-icons/fi';

export default function ClientsSection() {
  const clientTypes = [
    {
      icon: <FiHome className="h-10 w-10" />,
      title: "民宿 / 小店家 / 創作者",
      description: "讓預約、訂單、客服等日常工作自動化，省下大量時間與精力，專注在經營體驗與創作。",
    },
    {
      icon: <FiUser className="h-10 w-10" />,
      title: "一人公司 / 自由接案者",
      description: "把重複性的行政流程交給自動化系統，讓你能專注在核心價值，同時維持專業形象。",
    },
    {
      icon: <FiUsers className="h-10 w-10" />,
      title: "小型協會 / 社群 / 團隊",
      description: "簡化團隊協作流程，自動管理會員、活動與通知，讓成員間溝通與管理更加順暢。",
    },
  ];

  return (
    <section id="clients" className="py-20">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">我們最常協助的對象</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            不論你是經營小店、自由工作者，還是小型團隊，我們都能為你量身打造最適合的解決方案
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {clientTypes.map((client, index) => (
            <div 
              key={index} 
              className="text-center bg-white p-8 rounded-lg border border-gray-100 shadow-sm hover:shadow transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-50 text-[rgb(var(--primary-color))]">
                {client.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{client.title}</h3>
              <p className="text-gray-600">{client.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
export default function ClientsSection() {
  const clientTypes = [
    {
      title: '民宿 · 小店家 · 創作者',
      description: '讓預約、訂單、客服等日常工作自動化，省下大量時間與精力，專注在經營體驗與創作本身。',
    },
    {
      title: '一人公司 · 自由接案者',
      description: '把重複性的行政流程交給自動化，讓你能專注在核心價值，同時維持對外的專業形象。',
    },
    {
      title: '小型協會 · 社群 · 團隊',
      description: '簡化協作流程，自動管理會員、活動與通知，讓成員間的溝通與管理更順暢。',
    },
  ];

  return (
    <section id="clients" className="py-20 bg-[#faf9f6] border-t border-[#e8e4df]">
      <div className="container-custom">

        <div className="mb-14">
          <p className="text-[10px] font-bold text-[#b0aba5] tracking-[0.15em] uppercase mb-4">Who we work with</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1816]">我們最常協助的對象</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-[#e8e4df]">
          {clientTypes.map((client, index) => (
            <div
              key={index}
              className="p-8 lg:p-10 border-b md:border-b-0 md:border-r border-[#e8e4df] last:border-0"
            >
              <div className="w-6 h-[2px] bg-[#e8602c] mb-7" />
              <h3 className="text-[15px] font-bold text-[#1a1816] mb-4 leading-snug">{client.title}</h3>
              <p className="text-sm text-[#5c5a58] leading-relaxed">{client.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

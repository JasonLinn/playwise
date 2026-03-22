export default function ServicesSection() {
  const services = [
    {
      num: '01',
      title: '自動處理繁瑣的小事',
      description: '每天都在重複做一樣的事？我們幫你設定好流程，讓事情自己動起來，你可以把時間花在更重要的事上。',
      examples: ['表單送出後自動寄信通知', '每天自動整理客戶名單或訂單', '固定時間自動發訊息提醒'],
    },
    {
      num: '02',
      title: '設計聰明的客服小幫手',
      description: '想讓你的 LINE 或網站有個會聊天、會處理問題的助理？我們幫你打造懂品牌風格的智能管家，客人一問就答，還能引導完成預約或查詢。',
      examples: [],
    },
    {
      num: '03',
      title: '一對一規劃工作模式',
      description: '不確定從哪裡開始也沒關係。陪你聊聊現在遇到的問題，一起找出最簡單有效的解法，讓你事半功倍。',
      examples: [],
    },
  ];

  return (
    <section id="services" className="py-20 bg-white border-t border-[#e8e4df]">
      <div className="container-custom">

        <div className="mb-14">
          <p className="text-[10px] font-bold text-[#b0aba5] tracking-[0.15em] uppercase mb-4">Services</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1816]">我們可以幫你做什麼？</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e8e4df]">
          {services.map((service) => (
            <div key={service.num} className="bg-white p-8 lg:p-10 flex flex-col gap-5">
              <span className="text-xs font-bold text-[#e8602c]">{service.num}</span>
              <h3 className="text-[15px] font-bold text-[#1a1816] leading-snug">{service.title}</h3>
              <p className="text-sm text-[#5c5a58] leading-relaxed flex-1">{service.description}</p>
              {service.examples.length > 0 && (
                <ul className="space-y-2 pt-2 border-t border-[#f0ede9]">
                  {service.examples.map((ex, i) => (
                    <li key={i} className="text-xs text-[#7a7674] flex gap-2">
                      <span className="text-[#e8602c] shrink-0">—</span>
                      {ex}
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

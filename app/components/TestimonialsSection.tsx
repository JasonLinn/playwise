import { FiStar } from 'react-icons/fi';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "省下好多時間，終於不用每天自己手動處理了！",
      author: "小明",
      role: "民宿主人",
      rating: 5
    },
    {
      quote: "客人回覆速度變快，流程也更順了！",
      author: "小華",
      role: "咖啡店店長",
      rating: 5
    },
    {
      quote: "本來以為很難，結果超簡單，還蠻好玩的～",
      author: "小芳",
      role: "手作創業者",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">客戶怎麼說</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            聽聽我們的客戶如何透過智遊工作室的協助，讓工作更加輕鬆
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <div className="flex text-yellow-400 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl mb-6 italic text-gray-700">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
import Link from 'next/link';
import Image from 'next/image';

export default function PortfolioSection() {
    const works = [
        {
            title: "玩宜蘭民宿",
            description: "以檜木為主題的日式風格民宿，提供舒適寧靜的住宿體驗。網站設計融合了日式美學與現代簡約風格。",
            image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=900&h=1200&fit=crop",
            link: "/works/bnb",
            tags: ["Website", "Design", "RWD"]
        }
        // Future works can be added here
    ];

    return (
        <section id="portfolio" className="py-20 bg-white">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">精選作品</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        我們協助客戶打造的精美網站與數位體驗
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {works.map((work, index) => (
                        <Link href={work.link} key={index} className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={work.image}
                                    alt={work.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                            </div>

                            <div className="p-6">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {work.tags.map((tag, i) => (
                                        <span key={i} className="text-xs font-medium px-2.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-[rgb(var(--primary-color))] transition-colors">
                                    {work.title}
                                </h3>
                                <p className="text-gray-600 line-clamp-2">
                                    {work.description}
                                </p>
                                <div className="mt-4 flex items-center text-[rgb(var(--primary-color))] font-medium">
                                    查看詳情
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

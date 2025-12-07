import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
    {
        quote: "I was terrified of technology. I'd been selling at farmers markets for years but thought online was too complicated. I set up my candle store in one afternoon. Now I ship across the country!",
        name: "Maria Gonzalez",
        business: "Cozy Light Candles",
        result: "From local markets to nationwide shipping"
    },
    {
        quote: "I put off making a website for 3 years because it seemed overwhelming. This was so easy my teenage daughter was impressed. My t-shirt sales doubled in the first month.",
        name: "James Wilson",
        business: "Wilson Custom Tees",
        result: "Sales doubled in 30 days"
    },
    {
        quote: "As a retired teacher, I thought online selling wasn't for me. Wrong! My handmade jewelry store was up in a day. I just tell people what to buy and they can pay right there.",
        name: "Patricia Moore",
        business: "Patty's Treasures",
        result: "From hobby to $2K/month side income"
    }
];

const Testimonials: React.FC = () => {
    return (
        <section className="py-24">
            <div className="container mx-auto max-w-6xl px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Real People, Real Stores
                    </h2>
                    <p className="text-gray-400">
                        These aren't tech companies. They're people just like you.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-300 mb-6 leading-relaxed">"{t.quote}"</p>
                            <div className="border-t border-white/5 pt-4">
                                <p className="font-semibold text-white">{t.name}</p>
                                <p className="text-sm text-gray-500">{t.business}</p>
                                <p className="text-sm text-green-400 mt-2">✓ {t.result}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

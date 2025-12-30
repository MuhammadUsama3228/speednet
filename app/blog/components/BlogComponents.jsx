/**
 * Reusable Blog CTA (Call-to-Action) Component
 */
export function BlogCTA({
    title = "Test Your Speed Now",
    description = "Get detailed results for download, upload, ping, and jitter in 60 seconds.",
    buttonText = "Run Free Speed Test →",
    gradient = "from-blue-600 to-cyan-600",
    textColor = "text-blue-600"
}) {
    return (
        <div className={`bg-gradient-to-br ${gradient} p-6 sm:p-8 rounded-3xl text-center text-white my-10 sm:my-12 shadow-xl shadow-blue-500/10`}>
            <h3 className="text-xl sm:text-2xl font-black mb-3 leading-tight">{title}</h3>
            <p className="text-sm sm:text-base text-blue-50/90 mb-6 max-w-md mx-auto">{description}</p>
            <a
                href="/"
                className={`inline-block bg-white ${textColor} font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-xl hover:bg-blue-50 active:scale-95`}
            >
                {buttonText}
            </a>
        </div>
    );
}

/**
 * Quick Answer Box Component
 */
export function QuickAnswer({ title = "⚡ Quick Answer", children, color = "emerald" }) {
    const colorClasses = {
        emerald: "from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-emerald-900 dark:text-emerald-100",
        blue: "from-blue-50 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300 text-blue-900 dark:text-blue-100"
    };

    const [bgGradient, borderColor, titleColor, textColor] = (colorClasses[color] || colorClasses.emerald).split(' ');

    return (
        <div className={`my-8 p-5 sm:p-6 bg-gradient-to-br ${bgGradient} border-2 ${borderColor} rounded-2xl shadow-lg shadow-emerald-500/5`}>
            <h2 className={`text-base sm:text-lg font-black mb-3 ${titleColor} flex items-center gap-2 uppercase tracking-wide`}>
                {title}
            </h2>
            <div className={`${textColor} leading-relaxed text-sm sm:text-base`}>
                {children}
            </div>
        </div>
    );
}

/**
 * Info Box Component (for tips, warnings, references)
 */
export function InfoBox({ type = "info", title, children }) {
    const types = {
        info: "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300",
        warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-500 text-amber-700 dark:text-amber-300",
        danger: "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300",
        tip: "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300",
        reference: "bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-300"
    };

    return (
        <div className={`my-8 p-5 sm:p-6 ${types[type]} border-l-[6px] rounded-r-2xl shadow-sm`}>
            {title && <h3 className="font-black text-base sm:text-lg mb-2 uppercase tracking-tight">{title}</h3>}
            <div className="text-sm sm:text-base leading-relaxed">
                {children}
            </div>
        </div>
    );
}

/**
 * Related Articles Component
 */
export function RelatedArticles({ articles }) {
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {articles.map((article, index) => (
                    <a
                        key={index}
                        href={article.href}
                        className="group p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-lg"
                    >
                        <span className={`text-xs font-bold ${article.categoryColor || 'text-blue-600 dark:text-blue-400'} uppercase`}>
                            {article.category}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {article.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{article.excerpt}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}

/**
 * FAQ Section Component (renders FAQs in HTML)
 */
export function FAQSection({ faqs, title = "Frequently Asked Questions" }) {
    return (
        <>
            <h2 id="faq" className="text-2xl font-bold mt-12 mb-6 text-slate-900 dark:text-white">{title}</h2>
            <div className="space-y-4 mb-8">
                {faqs.map((faq, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
                        <p className="text-slate-600 dark:text-slate-300 m-0 text-sm">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

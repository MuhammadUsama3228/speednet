import SimpleFooter from '../../components/SimpleFooter';

export default function BlogLayout({
    children,
    category,
    categoryColor = "blue",
    title,
    date,
    readTime = "5 min read",
    schemas = []
}) {

    const categoryColors = {
        blue: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
        green: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
        red: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
        purple: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30",
    };

    return (
        <article className="min-h-screen pt-24 pb-20 px-4 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-gray-200 transition-colors duration-300">
            <div className="max-w-3xl mx-auto backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 p-6 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">

                {/* Render all schemas */}
                {schemas.map((schema, index) => (
                    <script
                        key={index}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                    />
                ))}

                <header className="mb-8 sm:mb-10 text-center">
                    <span className={`inline-block px-3 py-1 mb-4 text-[10px] sm:text-xs font-black tracking-widest uppercase rounded-full ${categoryColors[categoryColor] || categoryColors.blue}`}>
                        {category}
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 text-slate-900 dark:text-white leading-tight tracking-tight">
                        {title}
                    </h1>
                    <div className="flex items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <time>{date}</time>
                        <span className="opacity-30">•</span>
                        <span>{readTime}</span>
                    </div>
                </header>

                <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert mx-auto leading-relaxed mb-12">
                    {children}
                </div>

                <SimpleFooter />
            </div>
        </article>
    );
}

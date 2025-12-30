import SpeedTest from './SpeedTest'
import SpeedHero from './components/SpeedHero'
import SEOContent from './components/SEOContent'
import SimpleFooter from './components/SimpleFooter'

export const metadata = {
  title: 'Internet Speedometer - Fast Speed Test',
  description: 'Check how fast is my internet with our accurate Internet Speedometer. Run a fast speed test for wifi, broadband, and mobile in 30 seconds. 100% free.',
  keywords: [
    'fast speed test',
    'how fast is my internet',
    'internet speedometer',
    'netflix speed test',
    'wifi speed test',
    'internet speed test',
    'check my internet speed',
    'fast test',
    'broadband speed test',
    'network speed test'
  ],
  alternates: {
    canonical: '/',
  }
}

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900 dark:via-blue-800 dark:to-purple-900 transition-colors duration-300">
      <div className="pt-20 flex-grow">
        <SpeedHero />
        <div className="pb-10">
          <SpeedTest />
        </div>
        <SEOContent />
      </div>

      <SimpleFooter />
    </div>
  )
}

import SpeedTest from './SpeedTest'

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} — Fast, simple speed test`,
  description: 'A minimal speed test built with Next.js and Tailwind'
}

export default function Page(){
  return <SpeedTest />
}

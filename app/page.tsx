import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Next.js',
}
  
export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}

// continue reading:
// https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
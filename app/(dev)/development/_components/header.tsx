import Image from "next/image"
import Link from "next/link"

const DevHeader = () => {
  return (
    <header className="flex items-center mt-4 gap-10 p-3">
      <Image alt="unitap-beta" src="/logo.svg" width={200} height={40} />

      <Link href="/development/components" className="ml-10">
        Components
      </Link>
      <Link href="/development/get-started">Get Started</Link>
    </header>
  )
}

export default DevHeader

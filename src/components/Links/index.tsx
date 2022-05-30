import Link from 'next/link'

function Links() {
  return (
    <>
      <Link href="/">
        <a className="hover:opacity-100 opacity-80">Categories</a>
      </Link>
      <Link href="/about-us">
        <a className="hover:opacity-100 opacity-80">About Us</a>
      </Link>
      <Link href="/">
        <a className="hover:opacity-100 opacity-80">Contact Us</a>
      </Link>
    </>
  )
}

export default Links

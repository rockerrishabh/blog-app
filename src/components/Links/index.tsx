import Link from 'next/link'

function Links() {
  return (
    <>
      <Link href="/">
        <div className="hover:opacity-100 opacity-80 px-2">Categories</div>
      </Link>

      <Link href="/about-us">
        <a className="hover:opacity-100 opacity-80 px-2">About Us</a>
      </Link>

      <Link href="/">
        <a className="hover:opacity-100 opacity-80 px-2">Contact Us</a>
      </Link>
    </>
  )
}

export default Links

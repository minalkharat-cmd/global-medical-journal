import Link from 'next/link';
export default function Navbar() {
  return (
    <nav className='bg-white border-b border-gray-200 sticky top-0 z-50'>
      <div className='max-w-6xl mx-auto px-6'>
        <div className='flex items-center justify-between h-16'>
          <Link href='/' className='flex items-center gap-2'>
            <span className='text-blue-900 font-bold text-xl'>Medical Vanguard</span>
          </Link>
          <div className='hidden md:flex items-center gap-6 text-sm font-medium text-gray-600'>
            <Link href='/about' className='hover:text-blue-700 transition'>About</Link>
            <Link href='/articles' className='hover:text-blue-700 transition'>Articles</Link>
            <Link href='/guidelines' className='hover:text-blue-700 transition'>Guidelines</Link>
            <Link href='/editorial-board' className='hover:text-blue-700 transition'>Editorial Board</Link>
            <Link href='/contact' className='hover:text-blue-700 transition'>Contact</Link>
            <Link href='/submit' className='bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition'>Submit</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
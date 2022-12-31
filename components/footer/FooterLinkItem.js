import Link from "next/link";

export default function FooterLinkItem({ path, to, label }){
  return (
    <Link href={to}>
      <a className={`text-white hover:text-brightaqua duration-300 ${path === to ? 'text-white border-b-2' : ''}`}>
        { label }
      </a>
    </Link>    
  );
}

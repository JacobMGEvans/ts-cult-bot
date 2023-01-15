import Link from 'next/link';
import { Authbutton } from "./AuthButton";

export const Header: React.FC = () => {
  return (
    <header className="container flex items-center px-4 py-6">
      <h1 className="flex-grow text-2xl">
         <Link href="/dashboard">
         Dashboard
         </Link>
         </h1>
      <nav className="">
        <ul className="flex flex-row items-center text-xl">
          <li className="mx-4"><Link href="/dashboard/resources">Resources</Link></li>
          <li className="mx-4"><Link href="/dashboard/job-posts">Job Posts</Link></li>
          <li className="mx-4"><Link href="/dashboard/warnings">Warnings</Link></li>
          <li className="mx-4"><Link href="/dashboard/theoisms">Theoisms</Link></li>
          <li className="mx-4">
            <Authbutton />
          </li>
        </ul>
      </nav>
    </header>
  );
};

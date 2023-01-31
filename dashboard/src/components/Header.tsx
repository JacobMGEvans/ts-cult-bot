import Link from 'next/link';
import { Authbutton } from './AuthButton';
import { Title } from './ui/Title';

export const Header: React.FC = () => {
  return (
    <header className="container flex items-baseline px-4 py-6">
      <Title type="h2">
        <Link href="/dashboard">Dashboard</Link>
      </Title>

      <nav className="">
        <ul className="flex flex-row items-baseline justify-end text-xl">
          <li className="mx-4">
            <Link href="/dashboard/resources">Resources</Link>
          </li>
          <li className="mx-4">
            <Link href="/dashboard/job-posts">Job Posts</Link>
          </li>
          <li className="mx-4">
            <Link href="/dashboard/warnings">Warnings</Link>
          </li>
          <li className="mx-4">
            <Link href="/dashboard/theoisms">Theoisms</Link>
          </li>
          <li className="mx-4">
            <Authbutton />
          </li>
        </ul>
      </nav>
    </header>
  );
};

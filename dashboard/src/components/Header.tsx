import { Authbutton } from "./AuthButton";

export const Header: React.FC = () => {
  return (
    <div className="flex w-full items-center px-4 py-6 text-white">
      <h1 className="flex-grow text-2xl">Dashboard</h1>
      <nav className="">
        <ul className="flex flex-row items-center text-xl">
          <li className="mx-4">Resources</li>
          <li className="mx-4">Job Posts</li>
          <li className="mx-4">Warnings</li>
          <li className="mx-4">Theoisms</li>
          <li className="mx-4">
            <Authbutton />
          </li>
        </ul>
      </nav>
    </div>
  );
};

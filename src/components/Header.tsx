"use client";
import sign from "../../public/rinku_sign.png";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { CiMenuFries } from "react-icons/ci";
import { FaSkull } from "react-icons/fa6";
import Image from "next/image";

const links = [
  {
    name: "home",
    path: "/",
  },
  // {
  //   name: "services",
  //   path: "/services",
  // },
  {
    name: "work",
    path: "/work",
  },
  {
    name: "About-Me",
    path: "/about-me",
  },
  {
    name: "contect",
    path: "/contect",
  },
];

const DesktopNav = () => {
  const pathname = usePathname();
  return (
    <nav className="flex gap-8" role="navigation">
      {links.map((link, index) => {
        return (
          <Link
            href={link.path}
            prefetch={false}
            scroll={false}
            replace={false}
            key={index}
            className={`${
              link.path === pathname && "text-accent"
            } capitalize hover:text-accent transition-all`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  return (
    <>
      <div className="h-8">
        <CiMenuFries
          className="h-8 text-2xl text-white"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <div className={`${isOpen && "h-64 flex flex-col"} transition-all`}>
        {isOpen && (
          <nav
            role="navigation"
            className={`absolute flex flex-col items-center justify-start left-0 right-0 top-12 w-full p-4`}
          >
            {/* nav */}
            <div className="flex flex-col justify-center items-center gap-4 w-1/2">
              {links.map((link, index) => {
                return (
                  <Link
                    href={link.path}
                    key={index}
                    title={link.name}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`${
                      link.path === pathname && "text-accent"
                    } w-full p-2 text-base hover:text-accent text-center`}
                  >
                    <div className="capitalize"> {link.name} </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </>
  );
};

const Header = () => {
  return (
    <header
      aria-hidden="false"
      role="banner"
      className={`py-4 xl:py-4 text-white h-full shadow-g`}
    >
      <div className="px-4 flex justify-between xl:justify-around items-start xl:items-center h-full">
        {/* logo */}
        <Link
          href="/"
          prefetch={false}
          scroll={false}
          replace={false}
          title=": )"
          className="flex items-end gap-4"
        >
          <span className="text-2xl">🌱</span>
          <Image
            src={sign}
            alt="sign"
            width={75}
            height={60}
            priority={true}
            quality={100}
            loading="eager"
            className="h-8 w-14"
          />
          {/* <span className="text-2xl xl:text-3xl text-accent ">&real;<span className="text-[#000] text-xs xl:text-sm">&#10084;</span></span> */}
        </Link>

        {/* desktop navbar */}
        <div className="hidden lg:flex gap-8 items-center">
          <DesktopNav />
          <div className="flex gap-2 bg-transparent border-none">
            <Link
              href="https://github.com/sponsors/kumar-rinku0/"
              title="Sponsor me!"
              className="h-4 p-6 btn-outline hover:trasition-all leading-none uppercase"
            >
              Sponsor me{" "}
              <span className="text-red-500 text-lg">&nbsp;&#10084;</span>
            </Link>
          </div>
        </div>
        {/* mobile navbar */}
        <div className="flex lg:hidden h-full">
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;

import { SheetMenu } from "./sheet-menu";
import { UserNav } from "./user-nav";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky md:hidden top-0 z-10 w-full !bg-background shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 flex h-14 items-center justify-between  sm:mx-8">
        <div className="flex items-center space-x-4  lg:space-x-0">
          <SheetMenu />
          {/* <h1 className="font-bold text-white">{title}</h1> */}
        </div>
        <div className="flex w-fit flex-1 items-center justify-end ">
          <UserNav />
        </div>
      </div>
    </header>
  );
}

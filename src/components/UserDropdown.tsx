import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { MenuIcon } from "lucide-react";
  import Link from "next/link";
  import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
  
//   interface iAppProps {
//     userImage: string | null;
//   }
  
  export function UserDropdown() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto cursor-pointer outline-none">
          <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
            <MenuIcon className="w-6 h-6 lg:w-5 lg:h-5" />
  
            {/* <img
              src={
                userImage ??
                "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="user avatar"
              className="rounded-full h-8 w-8 hidden lg:block"
            /> */}
          </div>
        </DropdownMenuTrigger>
  
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link className="w-full" href="/saved">
              Saved
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <LogoutLink
                className="w-full"
                postLogoutRedirectURL='/'
            >
                Log Out
            </LogoutLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
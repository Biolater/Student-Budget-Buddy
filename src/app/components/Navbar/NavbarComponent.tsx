"use client";

import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  DropdownItem,
  Divider,
  NavbarItem,
} from "@nextui-org/react";
import { PiggyBank } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { ThemeSwitcher } from "../ThemeSwitcher";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

export const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/expenses", label: "Expenses" },
    { href: "/budget", label: "Budget" },
    { href: "/goals", label: "Goals" },
    { href: "/analysis", label: "Analysis" },
  ];

const handleSignOut = async () => {
  try {
    await signOut({ redirectUrl: "/" });
    toast.success("Signed out successfully");
  } catch (error) {
    toast.error("Failed to sign out. Please try again.");
  }
};

  return (
    <Navbar
      maxWidth="xl"
      isBordered
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        item: [
          "data-[active=true]:bg-secondary data-[active=true]:text-foreground",
        ],
      }}
    >
      <NavbarContent as="div">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
        <NavbarBrand as={Link} href={isSignedIn ? "/dashboard" : "/"} className="gap-3 text-foreground">
          <PiggyBank />
          <p className="font-bold text-inherit">Budget Buddy</p>
        </NavbarBrand>
      </NavbarContent>
      {isLoaded && isSignedIn && (
        <NavbarContent
          className="hidden md:flex gap-4 flex-grow"
          justify="center"
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <NavbarItem
                as={Link}
                isActive={pathname === link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary px-3 py-2 rounded-md text-sm"
              >
                {link.label}
              </NavbarItem>
            </li>
          ))}
        </NavbarContent>
      )}
      <NavbarContent as="div" justify="end">
        <ThemeSwitcher />
        {isLoaded && !isSignedIn && (
          <div className="md:flex gap-4 hidden">
            <Button
              variant="bordered"
              color="primary"
              as={Link}
              href="/sign-in"
            >
              Login
            </Button>
            <Button color="primary" as={Link} href="/sign-up">
              Sign Up
            </Button>
          </div>
        )}
        {isLoaded && isSignedIn && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                src={user.imageUrl || "https://via.placeholder.com/150"}
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="text-muted-foreground">
                  {user.emailAddresses[0].emailAddress}
                </p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="help">Help & Support</DropdownItem>
              <DropdownItem onClick={handleSignOut} key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
      <NavbarMenu>
        {isLoaded &&
          isSignedIn &&
          navLinks.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                color="foreground"
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        {!isSignedIn && (
          <>
            <NavbarMenuItem>
              <Link
                color="foreground"
                className="w-full"
                size="lg"
                href="/about"
              >
                About
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                color="foreground"
                className="w-full"
                size="lg"
                href="/features"
              >
                Features
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                color="foreground"
                className="w-full"
                size="lg"
                href="/benefits"
              >
                Benefits
              </Link>
            </NavbarMenuItem>
            <Divider className="my-2" />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                className="flex-grow"
                variant="bordered"
                color="primary"
                as={Link}
                href="/sign-in"
              >
                Login
              </Button>
              <Button
                className="flex-grow"
                color="primary"
                as={Link}
                href="/sign-up"
              >
                Sign Up
              </Button>
            </div>
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
};

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
} from "@nextui-org/react";
import { PiggyBank } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { ThemeSwitcher } from "../ThemeSwitcher";

type ButtonType =
  | "light"
  | "bordered"
  | "solid"
  | "flat"
  | "faded"
  | "shadow"
  | "ghost"
  | undefined;

export const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const menuItems = ["Profile", "Settings", "Logout"];
  const menuItemsNotSignedIn = [
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Features",
      href: "/features",
    },
    {
      label: "Benefits",
      href: "/benefits",
    },
  ];
  const menuItemsNotSignedIn2 = [
    {
      label: "Login",
      href: "sign-in",
      variant: "ghost",
    },
    {
      label: "Sign Up",
      href: "/sign-up",
      variant: "solid",
    },
  ];

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/expenses", label: "Expenses" },
    { href: "/budget", label: "Budget" },
    { href: "/goals", label: "Goals" },
    { href: "/analysis", label: "Analysis" },
  ];

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <Navbar isBordered shouldHideOnScroll onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand as={Link} href="/" className="gap-3 text-foreground">
          <PiggyBank />
          <p className="font-bold text-inherit">Budget Buddy</p>
        </NavbarBrand>
      </NavbarContent>
      {isLoaded && isSignedIn && (
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </NavbarContent>
      )}
      <NavbarContent justify="end">
        <ThemeSwitcher />
        {isLoaded && !isSignedIn && (
          <>
            <Button variant="bordered" className="hidden sm:flex">
              <Link className="text-foreground" href="/sign-in">
                Login
              </Link>
            </Button>
            <Button variant="solid" className="hidden sm:flex">
              <Link className="text-foreground" href="/sign-up">
                Sign Up
              </Link>
            </Button>
          </>
        )}
        {isLoaded && isSignedIn && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">
                  {user.emailAddresses[0].emailAddress}
                </p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
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
          menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                className="w-full"
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        {!isSignedIn && (
          <>
            {menuItemsNotSignedIn.map((item, index) => (
              <NavbarMenuItem key={`${item.href}-${index}`}>
                <Link
                  color="foreground"
                  className="w-full"
                  size="lg"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
            <Divider className="my-2" />
            {menuItemsNotSignedIn2.map((item, index) => (
              <Button
                as={Link}
                href={item.href}
                variant={item.variant as ButtonType}
                key={`${item.href}-${index}`}
              >
                <span
                  className="w-full text-large text-foreground"
                >
                  {item.label}
                </span>
              </Button>
            ))}
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
};

"use client";
import { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import { PiggyBank } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();

  const menuItems = ["Profile", "Settings", "Logout"];

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/expenses", label: "Expenses" },
    { href: "/budget", label: "Budget" },
    { href: "/goals", label: "Goals" },
    { href: "/analysis", label: "Analysis" },
  ];

  return (
    <Navbar isBordered shouldHideOnScroll onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="gap-3">
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
        <NavbarItem className="hidden lg:flex">
          <Link href="/sign-in">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/sign-up" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
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
      </NavbarMenu>
    </Navbar>
  );
};

export const AcmeLogo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

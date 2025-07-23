"use client";

import { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  DropdownItem,
  Divider,
  NavbarItem,
} from "@heroui/react";
import { PiggyBank } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { ThemeSwitcher } from "../ThemeSwitcher";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import { LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import UserSettingsModal from "../Settings/UserSettingsModal";

export const NavbarComponent = () => {
  // State to track if the component is mounted in the client
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();

  // Define your navigation links for authenticated users
  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/expenses", label: "Expenses" },
    { href: "/recurring-transactions", label: "Recurring Transactions" },
    { href: "/budget", label: "Budget" },
  ];

  // Define landing page navigation links for non-authenticated users
  const landingNavLinks = [
    { href: "#about", label: "About" },
    { href: "#features", label: "Features" },
    { href: "#benefits", label: "Benefits" },
  ];

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <Navbar
      maxWidth="2xl"
      isBordered
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      isBlurred
      classNames={{
        item: [
          "data-[active=true]:bg-secondary data-[active=true]:text-foreground",
        ],
      }}
    >
      {/* Top left section with the menu toggle and brand */}
      <NavbarContent as="div">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
        />
        <NavbarBrand
          as={Link}
          href={isSignedIn ? "/dashboard" : "/"}
          className="gap-3 text-foreground"
        >
          <PiggyBank aria-hidden="true" />
          <p className="font-bold text-inherit">Budget Buddy</p>
        </NavbarBrand>
      </NavbarContent>

      {/* Navigation links for signed in users */}
      {isLoaded && isSignedIn && (
        <NavbarContent className="hidden lg:flex gap-4 grow" justify="center">
          <LayoutGroup id="navbar-items">
            {navLinks.map((link) => (
              <li className="relative py-1.5" key={link.href}>
                <Link
                  id={link.href}
                  href={link.href}
                  className={`relative transition-colors hover:text-foreground px-3 ${
                    pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  } rounded-md text-sm z-10`}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
                {pathname === link.href && (
                  <motion.div
                    className="absolute inset-0 bg-secondary rounded-md"
                    layoutId="navbar-item-active"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </li>
            ))}
          </LayoutGroup>
        </NavbarContent>
      )}

      {/* Navigation links for non-signed in users (landing page) */}
      {isLoaded && !isSignedIn && (
        <NavbarContent className="hidden lg:flex gap-4 grow" justify="center">
          {landingNavLinks.map((link) => (
            <NavbarItem key={link.href}>
              <button
                onClick={() => scrollToSection(link.href)}
                className="relative transition-colors hover:text-foreground px-3 text-muted-foreground hover:text-foreground rounded-md text-sm cursor-pointer"
              >
                {link.label}
              </button>
            </NavbarItem>
          ))}
        </NavbarContent>
      )}

      {/* Right side: Theme switcher, auth buttons or user dropdown */}
      <NavbarContent as="div" justify="end">
        <ThemeSwitcher />
        {isLoaded && !isSignedIn && (
          <div className="hidden lg:flex gap-4">
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
                alt="User avatar"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="text-muted-foreground">
                  {user.emailAddresses[0].emailAddress}
                </p>
              </DropdownItem>
              <DropdownItem 
                key="settings" 
                onPress={() => setIsSettingsOpen(true)}
              >
                My Settings
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={() => {
                  signOut({ redirectUrl: "/sign-in" });
                  toast.success("Signed out");
                }}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {isLoaded && isSignedIn && (
          <>
            {navLinks.map((item, index) => (
              <NavbarMenuItem
                onClick={() => setIsMenuOpen(false)}
                key={`${item.href}-${index}`}
                isActive={pathname === item.href}
              >
                <Link className="w-full" color="foreground" href={item.href}>
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          </>
        )}
        {isLoaded && !isSignedIn && (
          <>
            {landingNavLinks.map((item) => (
              <NavbarMenuItem key={item.href}>
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="w-full text-left text-foreground"
                >
                  {item.label}
                </button>
              </NavbarMenuItem>
            ))}
            <Divider className="my-2" />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                className="grow"
                variant="bordered"
                color="primary"
                as={Link}
                href="/sign-in"
              >
                Login
              </Button>
              <Button
                className="grow"
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
      
      {/* Settings Modal */}
      {isSignedIn && (
        <UserSettingsModal 
          isOpen={isSettingsOpen} 
          onOpenChange={setIsSettingsOpen} 
        />
      )}
    </Navbar>
  );
};

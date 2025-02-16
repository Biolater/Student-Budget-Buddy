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

export const NavbarComponent = () => {
  // State to track if the component is mounted in the client
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

  // Define your navigation links
  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/expenses", label: "Expenses" },
    { href: "/budget", label: "Budget" },
    { href: "/goals", label: "Goals" },
    { href: "/analysis", label: "Analysis" },
  ];

  // Set isClient true once the component has mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent server-side rendering issues
  if (!isClient) {
    return null;
  }

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
      {/* Top left section with the menu toggle and brand */}
      <NavbarContent as="div">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
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
        <NavbarContent
          className="hidden md:flex gap-4 flex-grow"
          justify="center"
        >
          <LayoutGroup id="navbar-items">
            {navLinks.map((link) => (
              <li className="relative" key={link.href}>
                <NavbarItem
                  id={link.href}
                  as="button"
                  onClick={() => router.push(link.href)}
                  className={`relative text-muted-foreground transition-colors hover:text-foreground px-3 ${
                    pathname === link.href ? "text-foreground" : ""
                  } py-2 rounded-md text-sm z-10`}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </NavbarItem>
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

      {/* Right side: Theme switcher, auth buttons or user dropdown */}
      <NavbarContent as="div" justify="end">
        <ThemeSwitcher />
        {isLoaded && !isSignedIn && (
          <div className="hidden md:flex gap-4">
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
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="help">Help &amp; Support</DropdownItem>
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
        {isLoaded &&
          isSignedIn &&
          navLinks.map((item, index) => (
            <NavbarMenuItem
              key={`${item.href}-${index}`}
              isActive={pathname === item.href}
            >
              <Link className="w-full" color="foreground" href={item.href}>
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        {!isSignedIn && (
          <>
            <NavbarMenuItem>
              <Link color="foreground" className="w-full" href="/about">
                About
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link color="foreground" className="w-full" href="/features">
                Features
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link color="foreground" className="w-full" href="/benefits">
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

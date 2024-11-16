import { ThemeSwitcher } from "./components/ThemeSwitcher";

export default function Home() {
  return (
    <div className="flex w-full h-svh items-center justify-center">
      <h1>Hello World</h1>
      <ThemeSwitcher />
    </div>
  );
}

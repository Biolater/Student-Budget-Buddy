import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex py-6 min-h-svh items-center justify-center w-full">
      <SignUp />
    </div>
  );
}

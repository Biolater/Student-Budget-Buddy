import { SignIn } from "@clerk/nextjs";

export default function SignInComponent() {
  return (
    <div className="flex min-h-svh items-center justify-center w-full">
      <SignIn />
    </div>
  );
}

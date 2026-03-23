import { SigninForm } from "@/components/auth/signin-form";

export default function SigninPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 absolute z-0 inset-0 bg-gradient-purple">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SigninForm />
      </div>
    </div>
  );
}

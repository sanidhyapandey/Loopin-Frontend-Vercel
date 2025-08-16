import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export function LoginScreen() {
  return (
    <div className="flex min-h-screen">
      <ClerkLoading>
        <p>Loading...</p>
      </ClerkLoading>
      <ClerkLoaded>
        <div className="flex w-1/2 flex-col justify-center px-16 min-h-screen items-center">
          <SignIn routing="hash" afterSignInUrl="/dashboard" />
        </div>
        <div className="hidden w-1/2 bg-blue-600 lg:block">
          <div className="flex h-full flex-col items-center justify-center px-12 text-white">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold">Your AI-powered personal assistant</h2>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <ArrowRight className="mr-3 h-6 w-6 flex-shrink-0" />
                  <span>Connect multiple email providers and calendars in one place</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-3 h-6 w-6 flex-shrink-0" />
                  <span>Map your professional network with our dynamic contact graph</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-3 h-6 w-6 flex-shrink-0" />
                  <span>Get smart meeting context before, during, and after meetings</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-3 h-6 w-6 flex-shrink-0" />
                  <span>Never miss a follow-up with our smart memory chain</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </ClerkLoaded>
    </div>
  );
}

"use client"

import { LoginScreen } from "@/components/login-screen"
import { SignedIn, SignedOut, RedirectToSignIn, UserProfile, SignOutButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <LoginScreen />
    </div>
  )
}

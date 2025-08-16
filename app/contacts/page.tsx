import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { ContactsScreen } from "@/components/contacts-screen";

export default function ContactsPage() {
  return (
    <>
      <SignedIn>
        <ContactsScreen />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

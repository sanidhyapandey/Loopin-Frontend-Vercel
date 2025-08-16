import { useUser } from "@clerk/nextjs";

export function useUserEmail() {
  const { user } = useUser();
  return user?.emailAddresses?.[0]?.emailAddress || "";
}

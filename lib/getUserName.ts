import { useUser } from "@clerk/nextjs";

export function useUserName() {
  const { user } = useUser();
  // Clerk user object: https://clerk.com/docs/users/overview
  // Prefer user.fullName, fallback to firstName + lastName, fallback to email
  return (
    user?.fullName ||
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    user?.firstName ||
    user?.lastName ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "User"
  );
}

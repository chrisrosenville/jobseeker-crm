import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobseeeker - Auth",
  description: "Sign in or sign up to your account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

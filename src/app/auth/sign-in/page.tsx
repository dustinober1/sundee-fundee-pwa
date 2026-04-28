import type { Metadata } from "next";
import { AuthMagicLinkForm } from "@/components/pwa/AuthMagicLinkForm";

export const metadata: Metadata = {
  title: "Sign In",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInPage() {
  return <AuthMagicLinkForm />;
}

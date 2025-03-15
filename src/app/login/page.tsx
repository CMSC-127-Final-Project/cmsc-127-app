import LoginPage from "@/components/ui/login-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Your App Name",
  description: "Sign in to your account",
}

export default function Page() {
  return <LoginPage />
}
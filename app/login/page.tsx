import { redirect } from "next/navigation";
import { getSession } from "../lib/auth";
import { LoginForm } from "../components/LoginForm";

export default async function LoginPage() {
  if (await getSession()) redirect("/biblioteca");
  return <LoginForm />;
}

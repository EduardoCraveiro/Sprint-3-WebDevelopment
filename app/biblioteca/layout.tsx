import { redirect } from "next/navigation";
import { getSession } from "../lib/auth";
import JoviLibrary from "../components/JoviLibrary";

export default async function LibraryLayout({ children }: { children: React.ReactNode }) {
  if (!await getSession()) redirect("/login");
  return <><JoviLibrary />{children}</>;
}

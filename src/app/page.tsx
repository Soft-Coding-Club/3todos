import { auth } from "../../auth";
import { redirect } from "next/navigation";
import TodoApp from "@/components/TodoApp";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <TodoApp
      userName={session.user?.name ?? ""}
      userImage={session.user?.image ?? undefined}
    />
  );
}

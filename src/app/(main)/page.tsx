import UserList from "@/components/chat/UserList";

export default function Home() {
  return (
    <main className="flex flex-row gap-[32px] row-start-2 items-center sm:items-start">
      <UserList />
    </main>
  );
}

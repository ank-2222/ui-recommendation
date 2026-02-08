import { useCallback, useEffect, useState, type JSX } from "react";
import { LogIn, Loader2, Sparkles } from "lucide-react";
import { useGetUsers } from "@/feature/user/useGetUsers";
import type { user } from "@/interfaces/user";
import UserCard from "./components/UserCard";
import { getRecommendedUserIds } from "@/store/userSelectionStore";
import { InfoNote } from "@/components/InfoNote";

const LIMIT = 4;

function User(): JSX.Element {
  const [offset, setOffset] = useState<number>(0);
  const [users, setUsers] = useState<user[]>([]);
  const [recommendedIds, setRecommendedIds] = useState<number[]>([]);

  const { data, isLoading, isFetching } = useGetUsers(LIMIT, offset);

  const loadRecommended = useCallback(async () => {
    const ids = await getRecommendedUserIds();
    setRecommendedIds(ids);
  }, []);

  useEffect(() => {
    loadRecommended();
  }, [loadRecommended]);

  useEffect(() => {
    if (data?.users?.length) {
      setUsers((prev) => [...prev, ...data.users]);
    }
  }, [data]);

  const recommendedUsers = recommendedIds
    .map((id) => users.find((u) => u.id === id))
    .filter((u): u is user => u != null)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 flex flex-col justify-center sm:py-12">
      <section className="max-w-6xl mx-auto bg-white border rounded-xl shadow-sm p-4 sm:p-6">

        <InfoNote className="mb-6">
          <p className="font-medium mb-1">How this works</p>
          <p>
            Select a user below to log in. When you use the same user (or log in with certain users more often),
            they will appear in <strong>Recommended for you</strong> next time—so you can jump back in quickly.
            All of this is stored locally on your device; nothing is sent to a server.
          </p>
        </InfoNote>

        {recommendedUsers.length > 0 && (
          <>
            <h3 className="font-bold text-xl sm:text-2xl flex items-center gap-2 mb-3">
              <Sparkles size={22} className="text-amber-500" />
              Recommended for you
            </h3>
            <div className="flex flex-wrap gap-4 mb-6 p-3 rounded-lg bg-amber-50/50 border border-amber-100">
              {recommendedUsers.map((user) => (
                <UserCard
                  key={`rec-${user.id}`}
                  id={user.id}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  email={user.email}
                  username={user.username}
                  password={user.password}
                  role={user.role}
                  image={user.image}
                />
              ))}
            </div>
          </>
        )}

        <h3 className="font-bold text-xl sm:text-2xl flex items-center gap-2 mb-6">
          <LogIn size={22} />
          Login with below users
        </h3>

        {isLoading && offset === 0 && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {/* Users grid */}
        <div className="flex flex-wrap  gap-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              id={user.id}
              firstName={user.firstName}
              lastName={user.lastName}
              username={user.username}
              email={user.email}
              password={user.password}
              role={user.role}
              image={user.image}
            />
          ))}
        </div>

        {/* Empty state */}
        {!isLoading && users.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No users found
          </p>
        )}

        {/* Show more */}
        {users.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setOffset((prev) => prev + LIMIT)}
              disabled={isFetching}
              className="px-6 py-2 rounded-lg border font-medium
                         hover:bg-gray-100 transition disabled:opacity-50"
            >
              {isFetching ? "Loading..." : "Show more"}
            </button>
          </div>
        )}

      </section>
    </div>
  );
}

export default User;

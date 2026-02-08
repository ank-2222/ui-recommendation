import { Button } from "@/components/ui/button";
import type { user } from "@/interfaces/user";
import { Shield, User, Loader2 } from "lucide-react";
import useLogin from "@/feature/user/useLogin";

function UserCard({
  firstName,
  lastName,
  email,
  username,
  password,
  id,
  image,
  role,
}: user) {
  const { isPending, loginUser } = useLogin();

  const handleLogin = () => {
    if (!username || !password || id == null) return;
    loginUser({ username, password });
  };

  return (
    <div className="flex-1">
      <div className="border w-full p-4 rounded-md shadow-md mb-2 flex items-center justify-between gap-4">
        <div className="flex justify-start items-center gap-x-2">
          <div>
            <img
              src={image}
              alt={`${firstName} ${lastName}`}
              className="min-w-12 h-12 rounded-full border-2"
            />
          </div>
          <div>
            <h3 className="font-semibold text-base">
              {firstName} {lastName}{" "}
              {role === "admin" ? (
                <Shield size={16} className="inline ml-1" />
              ) : (
                <User size={16} className="inline ml-1" />
              )}
            </h3>
            <p className="font-normal text-sm">{email}</p>
          </div>
        </div>
        <div>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleLogin}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserCard;

import { useAuth } from "@/context/AuthContext";
import { loginService } from "@/services/auth";
import type { user } from "@/interfaces/user";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { recordUserSelection } from "@/store/userSelectionStore";

const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { isPending, mutate: loginUser } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginService,
    onSuccess: async (data) => {
      const selectedUserId = data.id;
      try {
        await recordUserSelection(selectedUserId);
      } catch (e) {
        console.warn("Failed to record user selection", e);
      }
      const userPayload: user = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        image: data.image,
      };
      login(userPayload, data.token);
      toast.success("Login successful");
      navigate("/app");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Invalid credentials");
    },
  });

  return { isPending, loginUser };
};

export default useLogin;

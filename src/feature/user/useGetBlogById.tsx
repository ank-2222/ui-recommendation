import { useQuery } from "@tanstack/react-query";
import { getBlogByIdService } from "@/service/Blog";
import { toast } from "sonner";
import { BLOG_RETRIEVED } from "@/constants/Blog";

export const useGetBlogById = (blogId: string) => {
  return useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      if (!blogId) {
        throw new Error("Blog ID is required");
      }

      const data = await getBlogByIdService(blogId);

      if (data.message_code !== BLOG_RETRIEVED) {
        toast.error("Something went wrong!");
        throw new Error("Unexpected response structure");
      }

      return data;
    },
    enabled: !!blogId, // Avoids fetching when blogId is undefined
  });
};

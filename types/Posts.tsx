import { Id } from "~/convex/_generated/dataModel";

export type PostCardProps = {
  post: {
    _id: Id<"posts">;
    content: string;
    created_at: string;
    mediaFiles?: (string | null)[];
    user: {
      username: string | null;
      imageUrl?: string | null;
    };
    repostCount: number;
    likeCount: number;
    bookmarkCount: number;
    commentCount: number;
  };
};

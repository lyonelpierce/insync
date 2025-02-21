import { Id } from "~/convex/_generated/dataModel";

export type PostCardProps = {
  post: {
    _id: Id<"posts">;
    _creationTime: number;
    content: string;
    created_at: string;
    mediaFiles?: string[];
    media?: string[];
    user_id: Id<"users">;
    creator: {
      _id: Id<"users">;
      _creationTime: number;
      bio?: string;
      clerkId?: string;
      created_at?: string;
      email?: string;
      first_name?: string;
      last_name?: string;
      imageUrl?: string | null;
      username: string | null;
    } | null;
    repostCount: number;
    likeCount: number;
    bookmarkCount: number;
    commentCount: number;
  };
};

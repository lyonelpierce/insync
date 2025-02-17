import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const addPost = mutation({
  args: {
    content: v.string(),
    mediaFiles: v.optional(v.array(v.string())),
    created_at: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user from the database
    const user = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Create the post
    const post = await ctx.db.insert("posts", {
      user_id: user._id,
      content: args.content,
      mediaFiles: args.mediaFiles,
      created_at: args.created_at,
      likeCount: 0,
      commentCount: 0,
      retweetCount: 0,
    });

    // Create media entries if there are media files
    if (args.mediaFiles && args.mediaFiles.length > 0) {
      await Promise.all(
        args.mediaFiles.map((storageId) =>
          ctx.db.insert("media", {
            post_id: post,
            url: storageId,
            type: "image", // You might want to make this dynamic based on the file type
            created_at: args.created_at,
          })
        )
      );
    }

    return post;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .order("desc")
      .take(20);

    // Fetch user information and media for each post
    const postsWithUsersAndMedia = await Promise.all(
      posts.map(async (post) => {
        const user = await ctx.db.get(post.user_id);
        
        if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
          return {
            ...post,
            user
          };
        }

        const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);

        return {
          ...post,
          user: {
            ...user,
            imageUrl: url
          },
          mediaFiles: await Promise.all(
            post.mediaFiles?.map(async (mediaId) => {
              const url = await ctx.storage.getUrl(mediaId as Id<'_storage'>);
              return url;
            }) ?? []
          )
        };
      })
    );

    return postsWithUsersAndMedia;
  },
});
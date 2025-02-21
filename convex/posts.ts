import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { mutation, QueryCtx } from "./_generated/server";

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
      repostCount: 0,
      likeCount: 0,
      bookmarkCount: 0,
      commentCount: 0,
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

export const getPosts = query({
  args: { paginationOpts: paginationOptsValidator, userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    let posts;

    if (args.userId) {
      posts = await ctx.db
        .query("posts")
        .filter((q) => q.eq(q.field("user_id"), args.userId))
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      posts = await ctx.db
        .query("posts")
        .order("desc")
        .paginate(args.paginationOpts);
    }

    // Fetch user information, media, and engagement counts for each post
    const postsWithMedia = await Promise.all(
      posts.page.map(async (post) => {
        const creator = await getPostCreator(ctx, post.user_id);
        const media = await getPostMedia(ctx, post.mediaFiles);

        return {
          ...post,
          creator,
          media,
        };
      })
    );

    return {
      ...posts,
      page: postsWithMedia,
    }
  },
});

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkId"), identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    // Check if like exists
    const existingLike = await ctx.db
      .query("likes")
      .filter(q => q.and(
        q.eq(q.field("post_id"), args.postId),
        q.eq(q.field("user_id"), user._id)
      ))
      .first();

    if (existingLike) {
      // Unlike: Delete like and decrease count
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.postId, {
        likeCount: (await ctx.db.get(args.postId))!.likeCount - 1
      });
      return false;
    } else {
      // Like: Create like and increase count
      await ctx.db.insert("likes", {
        user_id: user._id,
        post_id: args.postId,
        created_at: new Date().toISOString(),
      });
      await ctx.db.patch(args.postId, {
        likeCount: (await ctx.db.get(args.postId))!.likeCount + 1
      });
      return true;
    }
  },
});

export const toggleBookmark = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkId"), identity.subject))
      .first();
    if (!user) throw new Error("User not found");

    // Check if bookmark exists
    const existingBookmark = await ctx.db
      .query("bookmarks")
      .filter(q => q.and(
        q.eq(q.field("post_id"), args.postId),
        q.eq(q.field("user_id"), user._id)
      ))
      .first();

    if (existingBookmark) {
      // Remove bookmark and decrease count
      await ctx.db.delete(existingBookmark._id);
      await ctx.db.patch(args.postId, {
        bookmarkCount: (await ctx.db.get(args.postId))!.bookmarkCount - 1
      });
      return false;
    } else {
      // Add bookmark and increase count
      await ctx.db.insert("bookmarks", {
        user_id: user._id,
        post_id: args.postId,
        created_at: new Date().toISOString(),
      });
      await ctx.db.patch(args.postId, {
        bookmarkCount: (await ctx.db.get(args.postId))!.bookmarkCount + 1
      });
      return true;
    }
  },
});

export const checkLikeStatus = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;
    
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkId"), identity.subject))
      .first();
    if (!user) return false;

    const like = await ctx.db
      .query("likes")
      .filter(q => q.and(
        q.eq(q.field("post_id"), args.postId),
        q.eq(q.field("user_id"), user._id)
      ))
      .first();
    
    return !!like;
  },
});

export const checkBookmarkStatus = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;
    
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkId"), identity.subject))
      .first();
    if (!user) return false;

    const bookmark = await ctx.db
      .query("bookmarks")
      .filter(q => q.and(
        q.eq(q.field("post_id"), args.postId),
        q.eq(q.field("user_id"), user._id)
      ))
      .first();
    
    return !!bookmark;
  },
});

const getPostCreator = async (ctx: QueryCtx, userId: Id<"users">) => {
  const user = await ctx.db.get(userId);

  if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
    return user;
  }

  const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);

  return {
    ...user,
    imageUrl: url,
  };
};

const getPostMedia = async (ctx: QueryCtx, mediaFiles: string[] | undefined) => {
  if (!mediaFiles || mediaFiles.length === 0) {
    return [];
  }

  const urlPromises = mediaFiles.map((file) => ctx.storage.getUrl(file as Id<'_storage'>));
  const results = await Promise.allSettled(urlPromises);
  return results
    .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
    .map((result) => result.value);
};
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

export const list = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .order("desc")
      .take(20);

    // Fetch user information, media, and engagement counts for each post
    const postsWithUsersAndMedia = await Promise.all(
      posts.map(async (post) => {
        const user = await ctx.db.get(post.user_id);
        if (!user || !user.username) {
          throw new Error("User not found or username is missing");
        }
        
        // Get comment, like, and bookmark counts
        if (!user.imageUrl || user.imageUrl.startsWith('http')) {
          return {
            ...post,
            user,
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
          ),
        };
      })
    );

    return postsWithUsersAndMedia;
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

export const getUserPosts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the current user
    const user = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Fetch posts for the current user
    const posts = await ctx.db
      .query("posts")
      .filter(q => q.eq(q.field("user_id"), user._id))
      .order("desc")
      .take(20);

    // Process posts with media URLs
    const postsWithMedia = await Promise.all(
      posts.map(async (post) => {
        if (!user.imageUrl || user.imageUrl.startsWith('http')) {
          return {
            ...post,
            user,
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
          ),
        };
      })
    );

    return postsWithMedia;
  },
});
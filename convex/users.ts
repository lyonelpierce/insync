import { v } from 'convex/values';
import { internalMutation, mutation, query, QueryCtx } from './_generated/server';
import { Id } from './_generated/dataModel';

export const getUserByClerkId = query({
  args: {
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('clerkId'), args.clerkId))
      .unique();

    if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
      return user;
    }

    const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);

    return {
      ...user,
      imageUrl: url,
    };
  },
});

export const getUserById = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
      return user;
    }

    const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);

    return {
      ...user,
      imageUrl: url,
    };
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    username: v.union(v.string(), v.null()),
    bio: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    followersCount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert('users', {
      clerkId: args.clerkId,
      email: args.email,
      first_name: args.first_name,
      last_name: args.last_name,
      imageUrl: args.imageUrl,
      username: args.username || `${args.first_name}${args.last_name}`,
      bio: args.bio,
      created_at: new Date().toISOString(),
    });
    return userId;
  },
});

export const updateUser = mutation({
  args: {
    _id: v.id('users'),
    bio: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    profilePicture: v.optional(v.string()),
    pushToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);

    const { _id, ...rest } = args;
    return await ctx.db.patch(_id, rest);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  await getCurrentUserOrThrow(ctx);

  return await ctx.storage.generateUploadUrl();
});

export const updateImage = mutation({
  args: { storageId: v.id('_storage'), _id: v.id('users') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args._id, {
      imageUrl: args.storageId,
    });
  },
});

export const searchUsers = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query('users')
      .withSearchIndex('searchUsers', (q) => q.search('username', args.search))
      .collect();

    const usersWithImage = await Promise.all(
      users.map(async (user) => {
        if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
          user.imageUrl;
          return user;
        }

        const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);
        user.imageUrl = url!;
        return user;
      })
    );

    return usersWithImage;
  },
});

// IDENTITY CHECK
// https://docs.convex.dev/auth/database-auth#mutations-for-upserting-and-deleting-users

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(`Can't delete user, there is none for Clerk user ID: ${clerkUserId}`);
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query('users')
    .withIndex('byClerkId', (q) => q.eq('clerkId', externalId))
    .unique();
}

export const checkFriendshipStatus = query({
  args: {
    userId1: v.id('users'),
    userId2: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Check if there's a pending friend request
    const pendingRequest = await ctx.db
      .query('sync_requests')
      .filter(q => 
        q.or(
          q.and(
            q.eq(q.field('sender_id'), args.userId1),
            q.eq(q.field('receiver_id'), args.userId2)
          ),
          q.and(
            q.eq(q.field('sender_id'), args.userId2),
            q.eq(q.field('receiver_id'), args.userId1)
          )
        )
      )
      .first();

    if (pendingRequest) {
      return { status: pendingRequest.status, request: pendingRequest };
    }

    // Check if they are friends
    const areFriends = await ctx.db
      .query('friends')
      .filter(q =>
        q.or(
          q.and(
            q.eq(q.field('user1_id'), args.userId1),
            q.eq(q.field('user2_id'), args.userId2)
          ),
          q.and(
            q.eq(q.field('user1_id'), args.userId2),
            q.eq(q.field('user2_id'), args.userId1)
          )
        )
      )
      .first();

    return { status: areFriends ? 'friends' : 'none' };
  },
});

export const sendFriendRequest = mutation({
  args: {
    receiverId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const sender = await getCurrentUserOrThrow(ctx);
    
    return await ctx.db.insert('sync_requests', {
      sender_id: sender._id,
      receiver_id: args.receiverId,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
  },
});

export const respondToFriendRequest = mutation({
  args: {
    requestId: v.id('sync_requests'),
    accept: v.boolean(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);
    const request = await ctx.db.get(args.requestId);

    if (!request || request.receiver_id !== currentUser._id) {
      throw new Error('Invalid request');
    }

    if (args.accept) {
      // Create friendship
      await ctx.db.insert('friends', {
        user1_id: request.sender_id,
        user2_id: request.receiver_id,
        created_at: new Date().toISOString(),
      });
      
      // Update request status
      await ctx.db.patch(args.requestId, { status: 'accepted' });
    } else {
      await ctx.db.patch(args.requestId, { status: 'declined' });
    }
  },
});

export const cancelFriendRequest = mutation({
  args: {
    requestId: v.id('sync_requests'),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);
    const request = await ctx.db.get(args.requestId);

    if (!request || request.sender_id !== currentUser._id) {
      throw new Error('Invalid request');
    }

    await ctx.db.delete(args.requestId);
  },
});
import { v } from 'convex/values';
import { defineSchema, defineTable } from 'convex/server';

// User schema
export const User = {
  email: v.string(),
  clerkId: v.string(), // If using Clerk for authentication
  imageUrl: v.optional(v.string()),
  first_name: v.optional(v.string()),
  last_name: v.optional(v.string()),
  username: v.union(v.string(), v.null()),
  bio: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  followersCount: v.optional(v.number()),
  created_at: v.optional(v.string()), // Made optional and will be set during user creation
};

export const Device = {
  user_id: v.id('users'),
  device_name: v.string(),
  status: v.union(v.literal('online'), v.literal('offline')),
}

// Posts schema
export const Post = {
  user_id: v.id('users'),
  content: v.string(),
  mediaFiles: v.optional(v.array(v.string())), // Array of media file URLs
  repostCount: v.number(), // Default value 0
  likeCount: v.number(),
  bookmarkCount: v.number(),
  commentCount: v.number(),
  created_at: v.string(),
};

// Comments schema
export const Comment = {
  user_id: v.id('users'),
  post_id: v.optional(v.id('posts')), // Nullable for media comments
  media_id: v.optional(v.id('media')), // Nullable for post comments
  content: v.string(),
  created_at: v.string(),
};

// Likes schema
export const Like = {
  user_id: v.id('users'),
  post_id: v.optional(v.id('posts')), // Nullable for media likes
  media_id: v.optional(v.id('media')), // Nullable for post likes
  created_at: v.string(),
};

// Bookmarks schema
export const Bookmark = {
  user_id: v.id('users'),
  post_id: v.id('posts'),
  created_at: v.string(),
};

// Media schema
export const Media = {
  post_id: v.id('posts'),
  url: v.string(),
  type: v.string(), // e.g., "image", "video"
  likeCount: v.optional(v.number()), // Track likes
  commentCount: v.optional(v.number()), // Track comments
  created_at: v.string(),
};

// Friend Requests schema
export const SyncRequest = {
  sender_id: v.id('users'), // User who sends the request
  receiver_id: v.id('users'), // User who receives the request
  status: v.union(v.literal('pending'), v.literal('accepted'), v.literal('declined')), // Request status
  created_at: v.string(),
};

// Friends schema (after request is accepted)
export const Friend = {
  user1_id: v.id('users'),
  user2_id: v.id('users'),
  created_at: v.string(),
};

// Define schema with indexes
export default defineSchema({
  users: defineTable(User)
    .index('byUsername', ['username'])
    .index('byClerkId', ['clerkId'])
    .searchIndex("searchUsers", {
      searchField: "username",
    }),

  posts: defineTable(Post)
    .index('byUserId', ['user_id'])
    .index('byCreatedAt', ['created_at'])
    .index('byUserIdAndCreatedAt', ['user_id', 'created_at']),

  comments: defineTable(Comment)
    .index('byPostId', ['post_id'])
    .index('byMediaId', ['media_id']) // New index
    .index('byUserId', ['user_id'])
    .index('byPostIdAndCreatedAt', ['post_id', 'created_at'])
    .index('byMediaIdAndCreatedAt', ['media_id', 'created_at']), // New index

  likes: defineTable(Like)
    .index('byPostId', ['post_id'])
    .index('byMediaId', ['media_id']) // New index
    .index('byUserId', ['user_id'])
    .index('byPostIdAndUserId', ['post_id', 'user_id'])
    .index('byMediaIdAndUserId', ['media_id', 'user_id']), // New index

  bookmarks: defineTable(Bookmark)
    .index('byPostId', ['post_id'])
    .index('byUserId', ['user_id'])
    .index('byPostIdAndUserId', ['post_id', 'user_id']),

  media: defineTable(Media)
    .index('byPostId', ['post_id'])
    .index('byCreatedAt', ['created_at'])
    .index('byPostIdAndCreatedAt', ['post_id', 'created_at']),

  sync_requests: defineTable(SyncRequest)
    .index('byReceiverId', ['receiver_id'])
    .index('bySenderId', ['sender_id']),

  friends: defineTable(Friend)
    .index('byUserId', ['user1_id', 'user2_id']),
});

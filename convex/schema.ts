import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

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

// Posts schema
export const Post = {
  user_id: v.id('users'),
  content: v.string(),
  created_at: v.string(),
};

// Comments schema
export const Comment = {
  user_id: v.id('users'),
  post_id: v.id('posts'),
  content: v.string(),
  created_at: v.string(),
};

// Likes schema
export const Like = {
  user_id: v.id('users'),
  post_id: v.id('posts'),
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
  type: v.string(),
  created_at: v.string(),
};

// Follows schema (for following users)
export const Follow = {
  follower_id: v.id('users'),
  following_id: v.id('users'),
  created_at: v.string(),
};

// Friend Requests schema
export const FriendRequest = {
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

export const Message = {
  userId: v.id('users'), // Foreign key to users table
  threadId: v.optional(v.string()),
  content: v.string(),
  likeCount: v.number(), // Default value 0
  commentCount: v.number(), // Default value 0
  retweetCount: v.number(), // Default value 0
  mediaFiles: v.optional(v.array(v.string())), // Array of media file URLs
  websiteUrl: v.optional(v.string()), // Optional website URL
  created_at: v.optional(v.string()), // Made optional and will be set during user creation
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
    .index('byCreatedAt', ['created_at']),

  comments: defineTable(Comment)
    .index('byPostId', ['post_id'])
    .index('byUserId', ['user_id']),

  likes: defineTable(Like)
    .index('byPostId', ['post_id'])
    .index('byUserId', ['user_id']),

  bookmarks: defineTable(Bookmark)
    .index('byPostId', ['post_id'])
    .index('byUserId', ['user_id']),

  media: defineTable(Media)
    .index('byPostId', ['post_id'])
    .index('byCreatedAt', ['created_at']),

  follows: defineTable(Follow)
    .index('byFollowerId', ['follower_id'])
    .index('byFollowingId', ['following_id']),

  friend_requests: defineTable(FriendRequest)
    .index('byReceiverId', ['receiver_id'])
    .index('bySenderId', ['sender_id']),

  friends: defineTable(Friend)
    .index('byUserId', ['user1_id', 'user2_id']),

  messages: defineTable(Message)
    .index('byUserId', ['userId'])
    .index('byThreadId', ['threadId']),
});

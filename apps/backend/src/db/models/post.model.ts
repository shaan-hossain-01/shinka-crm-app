import { eq, desc, inArray } from "drizzle-orm";
import db from "../client";
import { posts, type Post, type NewPost } from "../schema/posts";
import { postLikes } from "../schema/postLikes";
import { postComments } from "../schema/postComments";
import { users } from "../schema/users";

/**
 * Create a new post
 */
export async function createPost(postData: NewPost): Promise<Post> {
  const [post] = await db.insert(posts).values(postData).returning();
  return post;
}

/**
 * Find post by ID with populated user data
 */
export async function findPostById(id: string) {
  const [post] = await db
    .select({
      id: posts.id,
      text: posts.text,
      photo: posts.photo,
      photo_content_type: posts.photo_content_type,
      created: posts.created,
      updated: posts.updated,
      postedBy: {
        _id: users.id,
        name: users.name,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.posted_by, users.id))
    .where(eq(posts.id, id));

  return post;
}

/**
 * Get posts for newsfeed (posts from followed users + own posts)
 */
export async function getNewsFeedPosts(userId: string, following: string[]) {
  // Include user's own posts in the feed
  const userIds = [...following, userId];

  const feedPosts = await db
    .select({
      id: posts.id,
      text: posts.text,
      photo: posts.photo,
      photo_content_type: posts.photo_content_type,
      created: posts.created,
      updated: posts.updated,
      postedBy: {
        _id: users.id,
        name: users.name,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.posted_by, users.id))
    .where(inArray(posts.posted_by, userIds))
    .orderBy(desc(posts.created));

  return feedPosts;
}

/**
 * Get posts by a specific user
 */
export async function getPostsByUser(userId: string) {
  const userPosts = await db
    .select({
      id: posts.id,
      text: posts.text,
      photo: posts.photo,
      photo_content_type: posts.photo_content_type,
      created: posts.created,
      updated: posts.updated,
      postedBy: {
        _id: users.id,
        name: users.name,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.posted_by, users.id))
    .where(eq(posts.posted_by, userId))
    .orderBy(desc(posts.created));

  return userPosts;
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<boolean> {
  const result = await db.delete(posts).where(eq(posts.id, id)).returning();
  return result.length > 0;
}

/**
 * Get likes count for a post
 */
export async function getPostLikesCount(postId: string): Promise<number> {
  const likes = await db
    .select()
    .from(postLikes)
    .where(eq(postLikes.post_id, postId));
  return likes.length;
}

/**
 * Get comments for a post
 */
export async function getPostComments(postId: string) {
  const comments = await db
    .select({
      id: postComments.id,
      text: postComments.text,
      created: postComments.created,
      postedBy: {
        _id: users.id,
        name: users.name,
      },
    })
    .from(postComments)
    .leftJoin(users, eq(postComments.posted_by, users.id))
    .where(eq(postComments.post_id, postId))
    .orderBy(desc(postComments.created));

  return comments;
}

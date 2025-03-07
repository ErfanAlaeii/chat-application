import { Request, Response } from 'express';
import { createPostService,getPostsService, getUserPostsService, publishPostService } from '../services/post.Service';
import { createPostSchema } from '../validations/post.validation';

export async function createPost(req: Request, res: Response) {
  const validatedData = createPostSchema.safeParse(req.body)
  if(!validatedData.success){
    return res.status(400).json({ error: validatedData.error.format() });
  }
  try {
    if(!req.user){
      return res.status(401).json({ message: "Unauthorized" });
    }
    const authorId = req.user.id;
    const post = await createPostService(validatedData.data, authorId);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}

export async function publishPost(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const authorId = req.user.id;
    const postId = req.params.id;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await publishPostService(postId, authorId);
    
    res.status(200).json({ message: "Post published successfully", post });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Post not found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Unauthorized") {
        return res.status(403).json({ message: error.message });
      }
    }
    res.status(500).json({ message: "An unexpected error occurred" });
  }
}



export async function getPosts(req: Request, res: Response) {
  try {
    const posts = await getPostsService();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

export async function getUserPosts(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const authorId = req.user.id;
    const posts = await getUserPostsService(authorId);
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}


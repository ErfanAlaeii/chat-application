import { Router } from 'express';
import { 
  createPost, 
  publishPost, 
  getPosts, 
  getUserPosts 
} from '../controllers/post.Controller';

const router = Router();

router.post('/posts', createPost); 
router.patch('/posts/:id/publish', publishPost); 
router.get('/posts', getPosts);
router.get('/user/posts', getUserPosts); 

export default router;

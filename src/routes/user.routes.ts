import { Router } from 'express';
import { 
  createUserController, 
  loginUserController, 
  listUsersController, 
  getUserByIdController, 
  updateUserController, 
  deleteUserController 
} from '../controllers/user.controller';
import { jwtAuth,checkAdmin } from '../middlewares/auth.middleware';


const router = Router();


router.post('/register', createUserController);
router.post('/login', loginUserController);


router.get('/', jwtAuth, checkAdmin, listUsersController);
router.get('/:id', jwtAuth, getUserByIdController);
router.put('/:id', jwtAuth, checkAdmin, updateUserController);
router.delete('/:id', jwtAuth, checkAdmin, deleteUserController);


export default router;

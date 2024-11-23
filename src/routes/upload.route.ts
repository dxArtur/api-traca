import { Router } from "express"
import upload from "../config/multerConfig";
import cloudinary from '../config/cloudinaryConfig'
import { AppError } from "../errors/AppErrors";
import ERROR_MESSAGES from "./../custom/constants/ErrorMessages"
import STATUS_CODE from "./../custom/constants/StatusCode"
import { UpdateUserUseCase } from "../modules/users/update/updateUserUseCase";
import multer from "multer";
import { UpdateUserController } from "../modules/users/update/updateUserController";

const route = Router()

const storage = multer.memoryStorage();  // Usando a memória para armazenar o arquivo
const uploadMiddleware = multer({ storage }).single('photo')
/* route.post('/upload/profile-picture/:userId', uploadMiddleware, async (req, res, next) => {
  await UpdateUserController.getInstance().handle(req, res, next)
})  */

route.post('/upload/profile-picture/:userId', uploadMiddleware, async (req, res) => {
  const userId = req.params.userId
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma foto enviada' });
    }

    console.log(req.file)
    const result = cloudinary.v2.uploader.upload_stream(
      {
        folder: 'traca/profile_pictures/', // Pasta onde as fotos serão armazenadas
        resource_type: 'image', // Tipo do recurso, pode ser 'image', 'video', etc.
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Erro ao carregar a imagem', details: error });
        }

        const imageUrl = result?.secure_url||''
        
        console.log(UpdateUserUseCase.getInstance().execute(userId, {profilePicture: imageUrl}))
        
        res.status(200).json({
          message: 'Foto carregada com sucesso',
          url: result!.secure_url,  // URL segura da foto no Cloudinary
        });
      }
    );

    result.end(req.file.buffer)

  } catch (error) {
    throw error
  }
});

export default route 
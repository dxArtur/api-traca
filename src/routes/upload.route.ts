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
const uploadMiddleware = multer({ storage }).single('profilePicture')
/* route.post('/upload/profile-picture/:userId', uploadMiddleware, async (req, res, next) => {
  await UpdateUserController.getInstance().handle(req, res, next)
})  */

route.put('/upload/profile-picture/:userId', uploadMiddleware, async (req, res) => {
  const userId = req.params.userId
  try {
    // Upload da imagem para o Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: 'traca/profile_pictures/', // Pasta no Cloudinary
          resource_type: 'image', // Tipo de recurso
        },
        (error, result) => {
          if (error) {
            reject(error); // Rejeita a promessa em caso de erro
          } else {
            resolve(result); // Resolve com o resultado da imagem
          }
        }
      );

      uploadStream.end(req.file?.buffer!);  // Envia o buffer da imagem
    });

    // URL segura da imagem
    const imageUrl = uploadResult?.secure_url || '';

    // Chama o caso de uso para atualizar a foto de perfil do usuário no banco de dados
    const updatedUser = await UpdateUserUseCase.getInstance().execute(userId, { profilePicture: imageUrl });

    // Retorna sucesso com a URL da foto carregada
    return res.status(200).json({
      message: 'Foto carregada com sucesso',
      user: updatedUser,
      url: imageUrl, // URL segura da foto no Cloudinary
    });

  } catch (error) {
    throw error
  }
});

export default route;
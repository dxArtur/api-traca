import { Router } from "express"
import upload from "../config/multerConfig";
import cloudinary from '../config/cloudinaryConfig'
import { AppError } from "../errors/AppErrors";
import ERROR_MESSAGES from "./../custom/constants/ErrorMessages"
import STATUS_CODE from "./../custom/constants/StatusCode"
import { UpdateUserUseCase } from "../modules/users/update/updateUserUseCase";

const route = Router()

route.post('/upload/profile-picture/:userId', upload.single('photo'), async (req, res) => {
  const userId = req.params.userId
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma foto enviada' });
    }

    const result = await cloudinary.v2.uploader.upload_stream(
      {
        folder: 'traca/profile_pictures/', // Pasta onde as fotos serão armazenadas
        resource_type: 'image', // Tipo do recurso, pode ser 'image', 'video', etc.
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Erro ao carregar a imagem', details: error });
        }

        const imageUrl = result?.secure_url||''
        
        UpdateUserUseCase.getInstance().execute(userId, {profilePicture: imageUrl})
        
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
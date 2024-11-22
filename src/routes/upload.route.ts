import { Router } from "express"
import upload from "../config/multerConfig";
import cloudinary from '../config/cloudinaryConfig'

const route = Router()

route.post('/upload/profile-picture', upload.single('photo'), async (req, res) => {
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
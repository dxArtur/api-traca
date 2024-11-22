import multer from 'multer';

// Configuração do Multer para armazenamento em memória (sem salvar no servidor)
const storage = multer.memoryStorage(); // Armazena arquivos em memória

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // Limite de tamanho do arquivo (10MB)
});

export default upload;

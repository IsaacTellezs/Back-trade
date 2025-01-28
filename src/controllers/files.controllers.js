import { supabase } from "../config/supabaseClients.js";


export const uploadFile = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "No se envió ningún archivo." });
        }

        const filePath = `user-files/${file.originalname}`; 
        const { data, error } = await supabase.storage
            .from("files")
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true, 
            });

        if (error) throw error;

        
        const { publicUrl } = supabase.storage
            .from("files")
            .getPublicUrl(filePath);

        res.status(200).json({ message: "Archivo subido exitosamente", url: publicUrl });
    } catch (error) {
        console.error("Error al subir archivo:", error.message);
        res.status(500).json({ error: error.message });
    }
};


export const listFiles = async (req, res) => {
    try {
        // Lista los archivos en la carpeta "user-files" del bucket "files"
        const { data, error } = await supabase.storage.from("files").list("user-files");

        if (error) throw error;

        // Genera las URLs firmadas de los archivos
        const filesWithUrls = await Promise.all(data.map(async (file) => {
            const { data: { signedUrl } } = await supabase.storage
                .from("files")
                .createSignedUrl(`user-files/${file.name}`, 3600); 
            
            // console.log(`Archivo: ${file.name}, URL firmada: ${signedUrl}`); // Log para depuración
            
            return {
                name: file.name,
                url: signedUrl,
            };
        }));

        res.status(200).json(filesWithUrls);
    } catch (error) {
        console.error("Error al listar archivos:", error.message);
        res.status(500).json({ error: error.message });
    }
};
  
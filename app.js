const express = require('express');
const multer = require('multer');
const fs = require('fs'); // Importación del módulo fs
const path = require('path');
const { analyzeImage } = require('./services/computerVision');
const { deleteFile } = require('./utils/fileHandler');

const app = express();
const port = 3000;

// Configurar multer para cargar archivos
const upload = multer({ dest: 'uploads/' });

// Configurar carpeta pública
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Ruta para manejar la carga de imágenes
app.post('/upload', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path;

    try {
        console.log("Procesando imagen...");
        const imageBuffer = fs.readFileSync(imagePath); // Lee el archivo
        const analysisResult = await analyzeImage(imageBuffer); // Analiza la imagen

        // Limpiar archivo temporal
        deleteFile(imagePath);

        res.json({ success: true, analysis: analysisResult });
    } catch (error) {
        console.error("Error al analizar la imagen:", error.message);

        // Mostrar detalles del error si existen
        if (error.response) {
            console.error("Detalles del error de respuesta:", error.response.data);
        }

        // Asegurar limpieza del archivo temporal
        deleteFile(imagePath);

        res.json({
            success: false,
            error: "Error durante el análisis. Revisa los logs del servidor.",
        });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

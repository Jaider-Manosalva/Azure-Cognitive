const fs = require('fs');
const path = require('path');

const readImage = (imagePath) => {
    try {
        const fullPath = path.resolve(__dirname, '../', imagePath);
        return fs.readFileSync(fullPath);
    } catch (error) {
        console.error("Error al leer el archivo de imagen:", error.message);
        throw error;
    }
};

const deleteFile = (filePath) => {
    try {
        fs.unlinkSync(filePath);
        console.log(`Archivo eliminado: ${filePath}`);
    } catch (error) {
        console.error("Error al eliminar el archivo:", error.message);
        throw error;
    }
};

module.exports = { readImage, deleteFile };

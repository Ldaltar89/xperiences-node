// const path = require("path");

// const getPdfContract = async (req, res) => {
//   const fileName = req.params.fileName;
//   const filePath = path.join(
//     __dirname,
//     "downloader/pdf",
//     fileName
//   ); // Ruta donde se guardan los PDF

//   // Envía el archivo como respuesta
//   res.download(filePath, fileName, (err) => {
//     if (err) {
//       console.error("Error al descargar el archivo:", err);
//       res.status(500).json({ error: "Error al descargar el archivo" });
//     }
//   });
// };

// module.exports = { getPdfContract };

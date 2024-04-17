const puppeteer = require("puppeteer");

const generatePDF = async (contractHTML, user) => {

  // Encabezado que deseas agregar
  const headerHTML = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${user.name}_${user.lastname}_${user.dni}</title>
  </head>
  `;
  // Concatenar el encabezado con el contrato recibido
  const completeHTML = headerHTML + contractHTML;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(completeHTML);

  // Generar PDF en forma de buffer
  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();

  return pdfBuffer;
};

module.exports = { generatePDF };

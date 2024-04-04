// const puppeteer = require("puppeteer");
// const path = require("path");

// const generatePDF = async (user, contractHTML) => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   // Reemplazar variables en el contrato HTML
//   const processedContract = contractHTML
//     .replace(/{name}/g, user ? user.name : "")
//     .replace(/{dni}/g, user ? user.dni : "");

//   await page.setContent(processedContract);

//   // Generar PDF
//   const pdfName = `contract_${user.name}_${user.dni}_${Date.now()}.pdf`;
//   const pdfPath = path.join(__dirname, "pdfs", pdfName);
//   await page.pdf({ path: pdfPath, format: "A4" });

//   await browser.close();

//   return pdfPath;
// };

const puppeteer = require("puppeteer");

const generatePDF = async (contractHTML) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(contractHTML);

  // Generar PDF en forma de buffer
  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();

  return pdfBuffer;
};


module.exports = { generatePDF };
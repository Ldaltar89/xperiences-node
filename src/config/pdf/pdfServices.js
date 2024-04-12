
// const puppeteer = require("puppeteer");

// const generatePDF = async (contractHTML) => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   await page.setContent(contractHTML);

//   // Generar PDF en forma de buffer
//   const pdfBuffer = await page.pdf({ format: "A4" });

//   await browser.close();

//   return pdfBuffer;
// };
const pdf = require("html-pdf");

const generatePDF = async (contractHTML) => {
  return new Promise((resolve, reject) => {
    pdf.create(contractHTML).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};


module.exports = { generatePDF };
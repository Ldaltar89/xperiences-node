const { token } = require("morgan");
const nodemailer = require("nodemailer");
require("dotenv").config();

const createTrans = () => {
  const transport = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  });

  return transport;
};

const sendMail = async (user, token) => {
  const transport = createTrans();
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Confirmar dirección de correo electrónico</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #fafafa;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  h1 {
    color: #333333;
    font-size: 24px;
    text-align: center;
    margin-top: 0;
  }
  p {
    color: #666666;
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  .button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: #ffffff;
    text-decoration: none;
    border-radius: 5px;
  }
  .button:hover {
    background-color: #0056b3;
  }
</style>
</head>
<body>
  <div class="container">
    <h1>Por favor, confirma tu dirección de correo electrónico</h1>
    <p>Gracias por unirte a Brandindoor. Para completar el registro, por favor confirma tu dirección de correo electrónico haciendo clic en el botón de abajo:</p>
    <div style="text-align: center;">
      <a href="http://localhost:4000/api/auth/verification/reset-password/${token}" class="button">Confirmar dirección de correo electrónico</a>
    </div>
    <p>Si tienes algún problema al hacer clic en el botón de arriba, copia y pega el siguiente enlace en tu navegador:</p>
    <p>xperiences@info.com</p>
    <p>Gracias,<br>El equipo de Brandindoor</p>
  </div>
</body>
</html>
`;
  const info = await transport.sendMail({
    from: "xperiences@gmail.com",
    to: `${user.email}`,
    subject: `Bienvenido ${user.name} a tu comunidad`,
    html: htmlTemplate,
  });
  return;
};

const sendUserContractEmail = async (user, contractBuffer) => {
  const transport = createTrans();
   const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contrato generado para el usuario ${user.name}</title>
    </head>
    <body>
      <p>Su contrato ha sido generado correctamente.</p>
      <p>Adjunto encontrará el contrato generado para usted.</p>
    </body>
    </html>
  `;

  const mailOptions = {
    from: "xperiences@gmail.com",
    to: `${user.email}`,
    cc: "manager@example.com",
    subject: `Contrato generado para el usuario ${user.name}`, // Asunto del correo electrónico
    html: htmlTemplate,
    attachments: [
      {
        filename: `${user.name}_${user.lastname}_${user.dni}.pdf`, // Nombre personalizado del archivo PDF
        content: contractBuffer, // Contenido del archivo adjunto (PDF)
        contentType: "application/pdf", // Tipo de contenido del archivo adjunto
      },
    ],
  };

  // Enviar el correo electrónico
  await transport.sendMail(mailOptions);
};

const sendVerificationEmail = async (user, token) => {
  const transport = createTrans();
  const htmlTemplate = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer contraseña</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #fafafa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
      font-size: 24px;
      text-align: center;
      margin-top: 0;
    }
    p {
      color: #666666;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
    }
    .button:hover {
      background-color: #0056b3;
    }
  </style>
  </head>
  <body>
    <div class="container">
      <h1>Restablecer contraseña</h1>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña:</p>
      <div style="text-align: center;">
        <a href="http://localhost:4000/api/auth/verification/reset-password/${token}" class="button">Restablecer contraseña</a>
      </div>
      <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo electrónico.</p>
      <p>Gracias,<br>El equipo de Brandindoor</p>
    </div>
  </body>
  </html>  
`;
  const info = await transport.sendMail({
    from: "xperiences@gmail.com",
    to: `${user.email}`,
    subject: "Restablecer contraseña",
    html: htmlTemplate,
  });
  return;
};


module.exports = { sendMail, sendUserContractEmail, sendVerificationEmail };


import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host: 'smtp.titan.email', // Servidor SMTP de Hostinger
    port: 465, // Puerto seguro (SSL)
    secure: true, // Usar SSL 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD, 
    },
});

// Función para enviar correos electrónicos
export const sendPasswordResetEmail = async (email, resetLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Correo del remitente
        to: email, // Correo del destinatario
        subject: 'Recuperación de contraseña', // Asunto del correo
        html: `
            <p>Hola,</p>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
            <a href="${resetLink}">Restablecer contraseña</a>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
        `, // Cuerpo del correo en HTML
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw new Error('Error al enviar el correo electrónico');
    }
};
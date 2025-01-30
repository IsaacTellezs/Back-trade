
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
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <div style="background-color: #007bff; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Recuperación de Contraseña</h1>
                    </div>
                    <div style="padding: 20px;">
                        <p style="font-size: 16px; color: #333333;">Hola,</p>
                        <p style="font-size: 16px; color: #333333;">Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${resetLink}" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px; display: inline-block;">
                                Restablecer Contraseña
                            </a>
                        </div>
                        <p style="font-size: 16px; color: #333333;">Si no solicitaste este cambio, ignora este correo.</p>
                        <p style="font-size: 14px; color: #777777; margin-top: 20px;">Este enlace expirará en 24 horas por razones de seguridad.</p>
                    </div>
                    <div style="background-color: #f4f4f4; padding: 10px; text-align: center;">
                        <p style="font-size: 12px; color: #777777;">&copy; 2025 Trade Nation. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>
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
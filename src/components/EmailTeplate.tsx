interface EmailTemplateProps {
  name: string;
  resetLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ name, resetLink }) => (
  <div>
    <h1>Hola, {name}!</h1>
    <p>
      Hemos recibido una solicitud para restablecer tu contraseña en Marcio Wakuluk Producciones. Puedes restablecer tu
      contraseña haciendo clic en el siguiente enlace:
    </p>
    <a href={resetLink} style={{ color: "blue", textDecoration: "underline" }}>
      Restablecer contraseña
    </a>
    <p>Si no solicitaste un restablecimiento de contraseña, por favor ignora este correo.</p>
    <p>
      Saludos,
      <br />
      El equipo de Marcio Wakuluk Producciones
    </p>
  </div>
);

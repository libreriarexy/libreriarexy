# Configuración de Emails (Gmail SMTP)

Para que la web pueda enviar correos electrónicos (bienvenida, aprobación, confirmación de pedido), hemos configurado **Nodemailer**. Esto permite usar tu propia cuenta de Gmail.

## 1. Generar Contraseña de Aplicación (App Password)
Google no permite usar tu contraseña normal para estas aplicaciones por seguridad. Debes generar una especial:

1. Entrá a tu [Cuenta de Google](https://myaccount.google.com/).
2. En el menú de la izquierda, seleccioná **Seguridad**.
3. Asegurate de tener activada la **Verificación en dos pasos**.
4. En el buscador de arriba, escribí **"Contraseñas de aplicación"** o buscalo en la sección de Verificación en dos pasos.
5. Seleccioná "Correo" y "Otro (Nombre personalizado: WebRexy)".
6. Hacé clic en **Generar**.
7. Google te dará un código de **16 letras**. **Copialo y guardalo bien.**

## 2. Variables de Entorno
Debes agregar estas dos líneas a tu archivo `.env.local` y también en el panel de **Vercel**:

```env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=el-codigo-de-16-letras-sin-espacios
```

## 3. Formato Profesional
Los correos ya están configurados con un diseño de tarjeta, el logo de Librería Rexy (usando la imagen que subiste) y botones estilizados.

¡Con esto configurado, el sistema ya es 100% independiente de servicios externos! 🦖📧🚀

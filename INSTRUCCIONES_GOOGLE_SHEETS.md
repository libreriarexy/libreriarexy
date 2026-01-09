# Guía de Vinculación con Google Sheets

Para que WebRexy cargue tus productos desde tu hoja de cálculo, sigue estos pasos:

## 1. Preparar Google Cloud
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un **Nuevo Proyecto** (ej: "WebRexy Shop").
3. En el menú, busca **"APIs y Servicios" > "Biblioteca"**.
4. Busca **"Google Sheets API"** y actívala.

## 2. Crear Cuenta de Servicio (Credenciales)
1. Ve a **"APIs y Servicios" > "Credenciales"**.
2. Haz clic en **"Crear Credenciales" > "Cuenta de servicio"**.
3. Ponle un nombre (ej: "webrexy-bot") y dale a "Crear y Continuar" (puedes saltar los roles opcionales).
4. Una vez creada, haz clic en la cuenta de servicio (email con formato `...@project.iam.gserviceaccount.com`).
5. Ve a la pestaña **"Claves"** > **"Agregar clave"** > **"Crear clave nueva"** > **JSON**.
6. Se descargará un archivo `.json`. **¡Guárdalo bien!**

## 3. Preparar tu Hoja de Cálculo
1. Abre tu archivo de Google Sheets con los productos.
2. Asegúrate de que tenga una hoja llamada `Productos` con estas columnas (en orden):
   - **A (ID)**: Identificador único (ej: `p1`, `p2`).
   - **B (Nombre)**: Nombre del producto.
   - **C (Descripción)**: Detalle del producto.
   - **D (Precio)**: Precio (número).
   - **E (Stock)**: Cantidad disponible (número).
   - **F (Categoría)**: Categoría (ej: `Papelería`).
   - **G**: Imagen URL (Link a la foto principal. Si quieres más fotos, sepáralas con una coma `,` en esta misma celda).
   - **H**: Activo (`TRUE` o `FALSE`)
   - **I**: Detalle (Aquí puedes escribir una descripción larga y detallada del producto que se verá al hacer clic).
3. Haz clic en el botón **"Compartir"** (arriba a la derecha).
4. Agrega el **email de la cuenta de servicio** (el que creaste en el paso 2) como **Editor**.

## 4. Crear Hoja de Pedidos (NUEVO)
Para que el historial de ventas y stock funcione, crea una hoja llamada **`Pedidos`** con estas columnas:
- **A**: ID del Pedido
- **B**: ID de Usuario
- **C**: Email de Usuario
- **D**: Total
- **E**: Estado (`PENDING`, `PREPARED`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
- **F**: Fecha de Creación
- **G**: Items (Deja que el sistema escriba aquí, guardará los productos en formato texto)

## 5. Crear Hoja de Usuarios (NUEVO)
Crea una hoja llamada **`Usuarios`** con estas columnas para gestionar a tus clientes:
- **A**: ID de Usuario
- **B**: Email
- **C**: Nombre
- **D**: Rol (`ADMIN`, `CLIENT`, `PENDING`)
- **E**: Saldo (Número)
- **F**: Aprobado (`TRUE` o `FALSE`)
- **G**: Fecha de Registro
- **H**: Dirección
- **I**: Teléfono
- **J**: Contraseña (La clave que elige el usuario, visible para ti)

## 6. Conectar con WebRexy
1. Abre el archivo `.env.local` en tu proyecto (si no existe, créalo basándote en `.env.local.example`).
2. Copia los valores del archivo JSON descargado:
   ```env
   GOOGLE_CLIENT_EMAIL="tu-cuenta-de-servicio@..."
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
   GOOGLE_SHEETS_ID="el_id_de_tu_spreadsheet"
   ```
   *El ID de la hoja está en la URL: docs.google.com/spreadsheets/d/**ESTA_PARTE_ES_EL_ID**/edit*
3. Agrega esta línea para activar el modo Sheets:
   ```env
   USE_GOOGLE_SHEETS="true"
   ```
4. Reinicia la aplicación (`npm run dev`).

¡Listo! Tu catálogo ahora se sincronizará con Google Sheets.

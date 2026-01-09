# Configuración de Hoja de Usuarios

Para que el registro de usuarios funcione, debes agregar una nueva hoja (pestaña) en tu archivo de Google Sheets llamada **`Usuarios`**.

## Columnas Requeridas (Hoja `Usuarios`)
El orden es importante:

- **A**: ID (No tocar, generado por sistema)
- **B**: Email
- **C**: Nombre
- **D**: Rol (`CLIENT` o `PENDING`)
- **E**: Balance (Saldo)
- **F**: Aprobado (`TRUE` o `FALSE`)
- **G**: Fecha de Creación
- **H**: Dirección
- **I**: Teléfono

¡Una vez creada esta hoja, los nuevos registros aparecerán ahí automáticamente!

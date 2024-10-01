# Usa una imagen base de Node.js para compilar TypeScript
FROM node:alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios para la construcción
COPY ./ts/tsconfig.json ./tsconfig.json
COPY ./ts ./ts

# Instala TypeScript globalmente
RUN npm install -g typescript

# Compila TypeScript
RUN tsc --project tsconfig.json

# Debug: List contents of /app
RUN ls -R /app

# Usa una imagen base de Nginx para servir la aplicación
FROM nginx:alpine

# Copia el archivo index.html al directorio de Nginx
COPY ./index.html /usr/share/nginx/html/index.html

# Copia la carpeta de archivos estáticos al directorio de Nginx
COPY ./static /usr/share/nginx/html/static

# Copia los archivos JavaScript generados al directorio de Nginx
COPY --from=builder /app/../js /usr/share/nginx/html/js


# Expone el puerto 80 para acceder al servidor
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

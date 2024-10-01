# Usar una imagen base de Node.js
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar el package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código fuente al contenedor
COPY . .

# Compilar TypeScript a JavaScript
RUN npm run build

# Exponer el puerto en el que la aplicación estará escuchando
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["npm", "start"]

FROM node:18-alpine3.18 as deps 
RUN apk add --no-cache libc6-compat
WORKDIR /app 
COPY package.json package-lock.json ./
RUN npm ci 

FROM node:18-alpine3.15 as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine3.15 as runner
WORKDIR /usr/src/app
COPY package.json package-lock.json ./   
RUN npm ci --omit=dev  
COPY --from=builder /app/dist ./dist
COPY ./static /usr/src/app/static
# Crear las carpetas necesarias antes de ejecutar la app
RUN mkdir -p /usr/src/app/static/uploads/products /usr/src/app/static/uploads/authors

#Dar permiso para ejecutar la aplicacion
RUN adduser --disabled-password nest-app
RUN chown -R nest-app:nest-app /usr/src/app
USER nest-app

EXPOSE 4000

CMD ["node", "dist/main.js"]
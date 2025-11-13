FROM node:24
 
RUN apt update && apt install -y openssl
 
WORKDIR /app
 
COPY package.json ./
 
RUN npm install
 
COPY . .
 
RUN rm -rf ./src
 
EXPOSE 8000
 
CMD ["sh", "-c", "npm run build && npx prisma generate && npx prisma migrate deploy && npm run start:prod"]
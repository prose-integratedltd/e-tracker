FROM node:20-alpine AS build

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=https://portal.proseintegratedltd.com
ARG NEXT_GOOGLE_MAP_API_KEY=

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_GOOGLE_MAP_API_KEY=$NEXT_GOOGLE_MAP_API_KEY
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start", "--", "-p", "3000"]

FROM node:16.14-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json ./
COPY pnpm-lock.yaml .
RUN pnpm install
COPY . .

RUN pnpm build

EXPOSE 80
CMD [ "pnpm", "start" ]

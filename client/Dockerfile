FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install -g serve

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# ENV VITE_ENV=production
# ENV VITE_PROD_BASE_URL=http://59.89.67.87/api/
# ENV VITE_DEV_BASE_URL=http://59.89.67.87/api/

CMD ["serve", "-s", "dist" ]

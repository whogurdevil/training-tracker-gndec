FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

ENV VITE_ENV=development
ENV VITE_PROD_BASE_URL=https://training-tracker-gndec.onrender.com/api/
ENV VITE_DEV_BASE_URL=http://localhost:8000/api/

CMD ["npm", "run", "preview" ]
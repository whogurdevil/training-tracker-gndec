#setup  .conf fir nginx

location / {
    proxy_pass http://127.0.0.1:8080
}

location /api {
    proxy_pass http://127.0.0.1:8000
}


1. git clone https://github.com/whogurdevil/training-tracker-gndec
2. cd training-tracker-gndec/client
3. change **VITE_ENV=** in .env.production to **VITE_ENV=production** and **VITE_PROD_BASE_URL=** in .env.production to **VITE_PROD_BASE_URL=backend-server-url**
4. cd ../ ```docker-compose up```
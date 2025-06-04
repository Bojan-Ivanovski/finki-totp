FROM node:22-alpine AS builder

WORKDIR /frontend
ENV VITE_BACKEND_APP_URL=http://localhost:7777
ENV VITE_FRONTEND_APP_URL=http://localhost:5555

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /frontend/dist /usr/share/nginx/html

EXPOSE 5555

CMD ["nginx", "-g", "daemon off;"]
# Build stage
FROM node:16-alpine AS build

WORKDIR /usr/share/nginx/html

COPY package*.json ./

RUN npm install

COPY . .

# Final stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /usr/share/nginx/html /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

RUN apk add --update nodejs npm supervisor

COPY --from=build /usr/share/nginx/html/package*.json ./

RUN npm install

COPY --from=build /usr/share/nginx/html .

EXPOSE 8080

COPY supervisord.conf /etc/supervisord.conf

EXPOSE 8080

CMD ["supervisord", "-c", "/etc/supervisord.conf"]

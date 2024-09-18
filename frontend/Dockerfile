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

RUN echo '[supervisord]' > /etc/supervisord.conf && \
    echo 'nodaemon=true' >> /etc/supervisord.conf && \
    echo '' >> /etc/supervisord.conf && \
    echo '[program:tailwindcss]' >> /etc/supervisord.conf && \
    echo 'command=npx tailwindcss -i ./src/input.css -o ./src/output.css --watch' >> /etc/supervisord.conf && \
    echo 'stdout_logfile=/dev/stdout' >> /etc/supervisord.conf && \
    echo 'stdout_logfile_maxbytes=0' >> /etc/supervisord.conf && \
    echo 'stderr_logfile=/dev/stderr' >> /etc/supervisord.conf && \
    echo 'stderr_logfile_maxbytes=0' >> /etc/supervisord.conf && \
    echo '' >> /etc/supervisord.conf && \
    echo '[program:nginx]' >> /etc/supervisord.conf && \
    echo 'command=nginx -g "daemon off;"' >> /etc/supervisord.conf && \
    echo 'stdout_logfile=/dev/stdout' >> /etc/supervisord.conf && \
    echo 'stdout_logfile_maxbytes=0' >> /etc/supervisord.conf && \
    echo 'stderr_logfile=/dev/stderr' >> /etc/supervisord.conf && \
    echo 'stderr_logfile_maxbytes=0' >> /etc/supervisord.conf

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
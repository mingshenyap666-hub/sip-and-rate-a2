FROM node:22-bookworm-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY index.html tsconfig*.json vite.config.ts ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM php:8.3-apache
RUN apt-get update \
    && apt-get install -y --no-install-recommends libonig-dev \
    && docker-php-ext-install pdo_mysql mbstring \
    && a2enmod rewrite \
    && mkdir -p /var/lib/php/sessions && chmod 1733 /var/lib/php/sessions \
    && rm -rf /var/lib/apt/lists/*
COPY .devcontainer/php/apache.conf /etc/apache2/sites-available/000-default.conf
COPY deploy/php-production.ini /usr/local/etc/php/conf.d/sip-rate.ini
WORKDIR /var/www/project
COPY backend ./backend
COPY --from=frontend /app/dist ./public
EXPOSE 80

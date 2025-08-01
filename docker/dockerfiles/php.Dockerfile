FROM php:8.3-fpm-alpine

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
    bash \
    git \
    unzip \
    nginx \
    supervisor \
    libzip-dev \
    zip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libxml2-dev \
    icu-dev \
    postgresql-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_mysql \
    pdo_pgsql \
    gd \
    mbstring \
    zip \
    bcmath \
    xml \
    intl \
    fileinfo \
    opcache \
    && docker-php-ext-enable opcache


# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configure PHP
COPY php.ini /usr/local/etc/php/conf.d/php.ini

# Set working directory
WORKDIR /var/www/laravel

# Copy existing application directory
COPY . .

# Fix permissions
RUN mkdir -p /var/www/laravel/storage/framework/{cache,sessions,views} \
    && mkdir -p /var/www/laravel/bootstrap/cache \
    && chown -R www-data:www-data /var/www/laravel/storage \
    && chown -R www-data:www-data /var/www/laravel/bootstrap/cache
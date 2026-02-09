FROM php:8.4-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy existing application directory
COPY . .

# Install dependencies - remove lock file to avoid version conflicts
RUN rm -f composer.lock && composer update --no-dev --optimize-autoloader

# Create SQLite database
RUN mkdir -p database && touch database/database.sqlite

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Configure Apache
RUN a2enmod rewrite
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf

# Generate app key and run migrations
RUN php artisan key:generate --force || true

# Expose port
EXPOSE 80

# Start Apache
CMD ["sh", "-c", "php artisan migrate --force && php artisan db:seed --force && apache2-foreground"]

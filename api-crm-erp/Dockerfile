FROM php:8.2-fpm

# Instalar dependencias
RUN apt-get update && apt-get install -y     git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev     libmcrypt-dev libssl-dev     && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Crear directorio de la app
WORKDIR /var/www

# Copiar archivos
COPY . /var/www

# Permisos
RUN chown -R www-data:www-data /var/www

# Exponer el puerto
EXPOSE 9000

CMD ["php-fpm"]
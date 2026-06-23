FROM php:8.3-apache

RUN apt-get update \
    && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && (a2dismod mpm_event mpm_worker 2>/dev/null || true) \
    && a2enmod mpm_prefork rewrite \
    && rm -rf /var/lib/apt/lists/*

RUN printf '%s\n' \
    '<VirtualHost *:80>' \
    '    DocumentRoot /var/www/html/public' \
    '    <Directory /var/www/html/public>' \
    '        AllowOverride None' \
    '        Require all granted' \
    '        RewriteEngine On' \
    '        RewriteCond %{REQUEST_FILENAME} !-f' \
    '        RewriteCond %{REQUEST_FILENAME} !-d' \
    '        RewriteRule ^ index.php [L]' \
    '    </Directory>' \
    '</VirtualHost>' \
    > /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html
COPY . .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader

EXPOSE 8080

CMD ["sh", "-c", "a2dismod mpm_event mpm_worker >/dev/null 2>&1 || true; a2enmod mpm_prefork >/dev/null 2>&1 || true; sed -i \"s/Listen 80/Listen ${PORT:-8080}/\" /etc/apache2/ports.conf && sed -i \"s/:80>/:${PORT:-8080}>/\" /etc/apache2/sites-available/000-default.conf && apache2-foreground"]

FROM 10.10.150.149:5000/nginx:1.12

ADD .htpasswd /etc/nginx/.htpasswd
ADD www /var/www
RUN chmod -R 755 /var/www
RUN chown -R $USER:$USER /var/www/ruyiai-official/html

ADD conf/ruyiai.offcial.conf /etc/nginx/conf.d/ruyiai.offcial.conf

#!/bin/sh

sed -i "s|http://shm.local|$SHM_URL|" /var/www/scripts/shm/modules/shm_request.js

nginx -g "daemon off;"


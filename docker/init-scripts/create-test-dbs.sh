# CREATE USER postgres;
# ALTER USER postgres PASSWOD postgres;
# CREATE DATABASE testDB;
# GRANT ALL PRIVILEGES ON DATABASE testDB TO postgres;
    # CREATE USER postgres;

#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE testDB;
    GRANT ALL PRIVILEGES ON DATABASE testDB TO postgres;
EOSQL

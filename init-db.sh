#!/bin/bash

# Esperar a que la base de datos esté disponible
until psql -h "$PGHOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

# Crear la tabla 'devices'
if ! psql -h "$PGHOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOF
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    isCardSwitch BOOLEAN NOT NULL DEFAULT FALSE
);
EOF
then
  echo "Failed to create table"
fi

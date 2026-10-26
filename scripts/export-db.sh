#!/bin/sh
# Run from the project root. Credentials are read inside the database container.
set -eu
output="${1:-database_export/sip_rate-current.sql}"
docker compose exec -T db sh -c 'exec mariadb-dump --user="$MARIADB_USER" --password="$MARIADB_PASSWORD" --single-transaction --skip-lock-tables --no-tablespaces "$MARIADB_DATABASE"' > "$output"
printf 'Database exported to %s\n' "$output"

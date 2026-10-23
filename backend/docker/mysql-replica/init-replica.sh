#!/bin/sh
set -e

echo "=== Initializing MySQL Replica for Aceh Tamiang ==="

# Wait for Primary to be healthy and responsive
until mysqladmin ping -h mysql -uroot -proot --silent; do
  echo "Waiting for MySQL Primary to be ready..."
  sleep 2
done

# Create replication user on Primary if not exists
mysql -h mysql -uroot -proot -e "
CREATE USER IF NOT EXISTS 'repl_user'@'%' IDENTIFIED WITH mysql_native_password BY 'repl_password';
GRANT REPLICATION SLAVE ON *.* TO 'repl_user'@'%';
FLUSH PRIVILEGES;
"

# Obtain binary log position
MASTER_STATUS=$(mysql -h mysql -uroot -proot -e "SHOW MASTER STATUS\G")
CURRENT_LOG=$(echo "$MASTER_STATUS" | grep "File:" | awk '{print $2}')
CURRENT_POS=$(echo "$MASTER_STATUS" | grep "Position:" | awk '{print $2}')

echo "Master status: File=$CURRENT_LOG, Position=$CURRENT_POS"

# Configure replication on this replica
mysql -uroot -proot -e "
STOP REPLICA;
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='mysql',
  SOURCE_PORT=3306,
  SOURCE_USER='repl_user',
  SOURCE_PASSWORD='repl_password',
  SOURCE_LOG_FILE='$CURRENT_LOG',
  SOURCE_LOG_POS=$CURRENT_POS,
  GET_SOURCE_PUBLIC_KEY=1;
START REPLICA;
"

echo "=== MySQL Replication successfully configured and started! ==="

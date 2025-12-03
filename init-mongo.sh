#!/bin/bash

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to start..."
until mongosh --host mongodb:27017 --eval "print('MongoDB is ready')" > /dev/null 2>&1; do
  echo "MongoDB is unavailable - sleeping"
  sleep 2
done

echo "MongoDB is up - executing seeding"

# Run the seeding script
node /docker-entrypoint-initdb.d/seed.js

echo "Seeding completed"
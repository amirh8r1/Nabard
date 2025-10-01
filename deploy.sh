#!/bin/bash

# manager
echo "Running deploy.sh in manager directory..."
cd manager || exit 1
chmod +x deploy.sh
./deploy.sh || { echo "manager deploy failed"; exit 1; }
cd ..

# client
echo "Running deploy.sh in client directory..."
cd client || exit 1
chmod +x deploy.sh
./deploy.sh || { echo "client deploy failed"; exit 1; }
cd ..

echo "Deployment completed successfully!"

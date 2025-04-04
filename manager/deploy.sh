docker-compose -f ./deployment/docker-compose-infrastructure.yml up -d --abort-on-container-exit
docker-compose -f ./deployment/docker-compose.yml up --abort-on-container-exit

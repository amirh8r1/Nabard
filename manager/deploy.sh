docker compose -f ./deployment/docker-compose.yml down
docker compose -f ./deployment/docker-compose-infrastructure.yml down
docker compose -f ./deployment/docker-compose-infrastructure.yml up -d
docker compose -f ./deployment/docker-compose.yml up

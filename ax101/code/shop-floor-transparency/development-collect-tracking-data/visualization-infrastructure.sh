[[start:create-module]]
mkdir -p src/dashboard/provisioning/datasources
mkdir -p src/dashboard/provisioning/dashboards  
[[end:create-module]]

[[start:module]]
src/dashboard
├── data/
└── provisioning/
    ├── dashboards/
    └── datasources/
[[end:module]]

[[start:postgres]]
docker run -d \
    -e POSTGRES_USER=actyx \
    -e POSTGRES_PASSWORD=changeit \
    -e POSTGRES_DB=dashboard \
    -p 5432:5432 \
    postgres:12-alpine
[[end:postgres]]

[[start:grafana]]
docker run -d \
    -v ${PWD}/src/provisioning:/etc/grafana/provisioning/ \
    -e GF_AUTH_ANONYMOUS_ENABLED=true \
    -p 3000:3000 \
    --add-host="db:172.17.0.1" \
    grafana/grafana:7.5.4
[[end:grafana]]
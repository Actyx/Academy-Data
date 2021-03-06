#!/usr/bin/env bash

set -o errexit  # exit on error
set -o nounset  # don't allow unset variables
# set -o xtrace # enable for debugging

usage() {
  printf "Start dashboard and database.\nRequires docker on the path.\n\n"

  printf "Usage: $(basename "$0") "
  printf -- "[-h] "
  printf -- "[-v] "
  printf -- "[-c] "
  printf -- "[-i] "
  printf -- "[-s] "
  printf -- "[-x] "
  printf -- "[-d=< data >] "
  printf -- "[-p=< provisioning >] "
  printf "\n"

  printf "  -%s\t%s - %s%s\n" "h" "help" "Show this help message." ""
  printf "  -%s\t%s - %s%s\n" "v" "version" "Show version information." ""
  printf "  -%s\t%s - %s%s\n" "c" "clean" "Remove existing containers and data" ""
  printf "  -%s\t%s - %s%s\n" "i" "init" "Start containers for the first time" ""
  printf "  -%s\t%s - %s%s\n" "s" "start" "Start existing containers" ""
  printf "  -%s\t%s - %s%s\n" "x" "stop" "Stop running containers" ""
  printf "  -%s\t%s - %s%s\n" "d" "data" "Data folder for PostgreSQL data (relative to the current working directory)" " (default: grafana-provisioning)"
  printf "  -%s\t%s - %s%s\n" "p" "provisioning" "Data folder for provisioning Grafana (relative to the current working directory)" " (default: pg-data)"
}

version() {
  printf "0.0.1\n"
}

# default values
opt_help="false"
opt_version="false"
opt_clean="false"
opt_init="false"
opt_start="false"
opt_stop="false"
opt_provisioning="provisioning"
opt_data="data"

# declared functions
clean() {
  echo "Cleaning data ($opt_data) and removing docker images ..." 
  docker stop ax101-grafana && docker rm ax101-grafana 
  docker stop ax101-postgres && docker rm ax101-postgres 
  rm -rf $opt_data
  echo "Cleaning data ($opt_data) and removing docker images ..." 
}

init() {
  echo "Initializing and starting dashboard and database ..." 
  echo "PostgreSQL data folder: $opt_data" 
  mkdir -p $opt_data
  docker run -d --name ax101-postgres --restart always \
    -v ${PWD}/${opt_data}:/var/lib/postgresql/data \
    -e POSTGRES_USER=actyx \
    -e POSTGRES_PASSWORD=changeit \
    -e POSTGRES_DB=dashboard \
    -p 5432:5432 \
  postgres:12-alpine

# init grafana
  echo "Grafana provisioning folder data folder: $opt_provisioning" 
  docker run -d --name ax101-grafana --restart always \
    -v ${PWD}/${opt_provisioning}:/etc/grafana/provisioning/ \
    -e GF_AUTH_ANONYMOUS_ENABLED=true \
    -p 3000:3000 \
    --add-host="db:172.17.0.1" \
    grafana/grafana:7.5.4
  echo "... done." 
  echo "Open the dashboard at http://localhost:3000/d/actyx-ax101-1/ax101-dashboard or log in at http://localhost:3000/login using admin/admin" 
}
start() {
  echo "Starting existing containers w/ pre-populated data" 
  docker start ax101-postgres
  docker start ax101-grafana
  echo "... done." 
  echo "Open the dashboard at http://localhost:3000/d/actyx-ax101-1/ax101-dashboard or log in at http://localhost:3000/login using admin/admin" 
}
stop() {
  echo "Stopping running containers" 
  docker stop ax101-postgres
  docker stop ax101-grafana
  echo "... done." 
}

# option parsing
OPTSPEC=:hvcisxd:p:
while getopts $OPTSPEC option; do
  case "$option" in
    h ) opt_help="true"; usage; exit 0  ;;
    v ) opt_version="true"; version; exit 0  ;;
    c ) opt_clean="true"; clean;  ;;
    i ) opt_init="true"; init;  ;;
    x ) opt_stop="true"; stop;  ;;
    s ) opt_start="true"; start;  ;;
    d ) opt_data=$OPTARG;  ;;
    p ) opt_provisioning=$OPTARG;  ;;
   \? ) echo "Unknown option: -$OPTARG" >&2; exit 1;;
    : ) echo "Missing option argument for -$OPTARG" >&2; exit 1;;
    * ) echo "Unimplemented option: -$OPTARG" >&2; exit 1;;
  esac
done
if [ $OPTIND -eq 1 ]; then usage; exit 1; fi

shift $((OPTIND - 1))
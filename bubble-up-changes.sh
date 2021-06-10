#!/usr/bin/env bash

set -o errexit  # exit on error
set -o nounset  # don't allow unset variables
# set -o xtrace # enable for debugging

usage() {
  printf "Bubble up changes through multiple branches according to the sequence in .lesson-branch-sequence and optionally push them.\n"

  printf "Usage: $(basename "$0") "
  printf -- "[-h] "
  printf -- "[-v] "
  printf -- "[-p] "
  printf "\n"

  printf "  -%s\t%s - %s%s\n" "h" "help" "Show this help message." ""
  printf "  -%s\t%s - %s%s\n" "v" "version" "Show version information." ""
  printf "  -%s\t%s - %s%s\n" "p" "push" "Push all updated branches - know what you're doing" ""
}

version() {
  printf "0.0.1\n"
}

# default values
opt_help="false"
opt_version="false"
opt_push="false"

# declared functions

# option parsing
OPTSPEC=:hvp
while getopts $OPTSPEC option; do
  case "$option" in
    h ) opt_help="true"; usage; exit 0  ;;
    v ) opt_version="true"; version; exit 0  ;;
    p ) opt_push="true";  ;;
   \? ) echo "Unknown option: -$OPTARG" >&2; exit 1;;
    : ) echo "Missing option argument for -$OPTARG" >&2; exit 1;;
    * ) echo "Unimplemented option: -$OPTARG" >&2; exit 1;;
  esac
done
shift $((OPTIND - 1))

startBranch=$(git rev-parse --abbrev-ref HEAD)
previousBranch=""
echo $startBranch

while read branch; do
  if [ "$startBranch" = "$branch" ]; then
      previousBranch=$branch
      continue;
  elif [ "$previousBranch" == "" ]; then 
    echo "$branch before $startBranch. Ignoring."
    continue; 
  else
    git checkout $branch;
    echo "$branch after $startBranch. Merging $previousBranch."
    git merge -m "Merging updates from $previousBranch" $previousBranch
    if [ "$opt_push" == "true" ]; then
      git push
    fi;
  fi;
done < .lesson-branch-sequence

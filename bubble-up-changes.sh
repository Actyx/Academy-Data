#!/usr/bin/env bash
# Like this script? 
# Generate boilerplate for similar ones at https://bashplate.wolfgang-werner.net.

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


# convenience variables
__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
__file="${__dir}/$(basename "${BASH_SOURCE[0]}")"
__base="$(basename ${__file} .sh)"
__root="$(cd "$(dirname "${__dir}")" && pwd)" # update this to make it point your project's root


# this would be a good place to start writing your actual script.
echo "$__base was called with..."
echo -h, --help=$opt_help
echo -v, --version=$opt_version
echo -p, --push=$opt_push

startBranch=$(git rev-parse --abbrev-ref HEAD)
previousBranch=""
isAfterStartBranch=false
echo $startBranch

for branch in $(cat .lesson-branch-sequence); do
    if [ "$startBranch" = "$branch" ]; then
        isAfterStartBranch=true
    fi;
if [ "$isAfterStartBranch" != "true" ]; then 
    echo "$branch before $startBranch. Ignoring."
    continue; 
fi;
git checkout $branch;
if [ "$previousBranch" != "" ]; then
    echo "$branch after $startBranch. Merging."
    exit 1
    #git reset --hard origin/$branch
    #git merge $previousBranch
fi;
previousBranch=$branch
done
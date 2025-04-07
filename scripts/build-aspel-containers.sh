#!/bin/bash

# Build aspel containers for all packages that contain Dockerfiles,
# or for a specified list of package directories.
# Usage: bash ./scripts/build-aspel-containers.sh [package1 package2 ...]
# Example: bash ./scripts/build-aspel-containers.sh
# Example: bash ./scripts/build-aspel-containers.sh packages/asl packages/asl-attachments

if [ -z $GITHUB_AUTH_TOKEN ]; then
    echo "GITHUB_AUTH_TOKEN is not set. Please set it and try again."
    exit 1
fi
if [ -z $ART_AUTH_TOKEN ]; then
    echo "ART_AUTH_TOKEN is not set. Please set it and try again."
    exit 1
fi

args=("$@")
if [ ${#args[@]} -gt 0 ]; then
    for dir in $args; do
        if [ ! -f "$dir/Dockerfile" ]; then
            echo "$dir/Dockerfile not found. Please provide a valid directory."
            exit 1
        fi
    done
else
    for dir in packages/*; do
        if [ -f "$dir/Dockerfile" ]; then
            args+=("$dir")
        fi
    done
fi

for dir in "${args[@]}"; do
    echo "-----------------------------------------------"
    echo " 🚧  Building Docker image for $dir... Please wait!"
    echo "-----------------------------------------------"

    package_name=$(basename "$dir")

    docker build -f $dir/Dockerfile \
        --build-arg MODULE_PATHS="$(node ./ci/modulepaths.js $dir)" \
        --secret id=token,env=ART_AUTH_TOKEN \
        --secret id=github_token,env=GITHUB_AUTH_TOKEN \
        -t $package_name .
done
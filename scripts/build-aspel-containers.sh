#!/bin/bash

# Build aspel containers for all packages that contain Dockerfiles,
# or for a specified list of package directories.
#
# Set the GITHUB_AUTH_TOKEN and ART_AUTH_TOKEN environment variables
# to authenticate with GitHub and Artifactory respectively.
# Set NO_CACHE=1 to build without docker cache.
# Set PLAIN=1 to build with plain output.
#
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

cache=""
if [ "$NO_CACHE" = "1" ]; then
    echo "NO_CACHE is set. Building with no cache."
    cache="--no-cache"
fi

plain=""
if [ "$PLAIN" = "1" ]; then
    echo "PLAIN is set. Building with plain output."
    plain="--progress=plain"
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

    echo -e "\nCommand: docker build -f $dir/Dockerfile --build-arg MODULE_PATHS=\"\$(node ./ci/modulepaths.js $dir)\" --secret id=token,env=ART_AUTH_TOKEN --secret id=github_token,env=GITHUB_AUTH_TOKEN -t $package_name . $plain $cache"

    docker build -f $dir/Dockerfile \
        --build-arg MODULE_PATHS="$(node ./ci/modulepaths.js $dir)" \
        --secret id=token,env=ART_AUTH_TOKEN \
        --secret id=github_token,env=GITHUB_AUTH_TOKEN \
        -t $package_name . $plain $cache || exit 1
done

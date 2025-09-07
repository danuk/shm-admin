#!/bin/bash

REPO="danuk"

function build_and_push {
    TAGS=()
    for TAG in ${LABELS[*]}; do
        TAGS+=("$REPO/shm-$1:$TAG")
    done

    docker build --platform linux/amd64,linux/arm64 \
        $(printf " -t %s" "${TAGS[@]}") \
        --target $1 .

    for TAG in ${TAGS[*]}; do
        docker push $TAG
    done
}

GIT_BR=$(git rev-parse --abbrev-ref HEAD)
GIT_TAG=$(git describe --abbrev=0 --tags)

if [ $GIT_BR == "master" ]; then
    LABELS=("$GIT_TAG")
    VERSION_MINOR=$(echo $GIT_TAG | cut -d '.' -f 1,2)
    LABELS+=("$VERSION_MINOR")
else
    LABELS=("$GIT_BR")
fi

# Add custom tags
LABELS+=("$@")

REV=$(git rev-parse --short HEAD)
echo "Build version: ${GIT_TAG}-${REV}"
echo "TAGS: ${LABELS[@]}"

read -p "Press enter to continue..."
echo -n "${GIT_TAG}-${REV}" > app/version

build_and_push admin

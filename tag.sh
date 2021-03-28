#!/usr/bin/env bash

MAJOR=$1
MINOR=$2
PATCH=$3

PATCH_NAME=v${MAJOR}.${MINOR}.${PATCH}
MINOR_NAME=v${MAJOR}.${MINOR}
MAJOR_NAME=v${MAJOR}

echo "$MAJOR_NAME"
echo "$MINOR_NAME"
echo "$PATCH_NAME"

git push origin ":$MINOR_NAME"
git push origin ":$MAJOR_NAME"

git tag -d "${MAJOR_NAME}"
git tag -d "${MINOR_NAME}"
git tag -d "${PATCH_NAME}"

git tag -a "${MAJOR_NAME}" -m "Version $PATCH_NAME"
git tag -a "${MINOR_NAME}" -m "Version $PATCH_NAME"
git tag -a "${PATCH_NAME}" -m "Version $MAJOR_NAME"

git push origin "${MAJOR_NAME}"
git push origin "${MINOR_NAME}"
git push origin "${PATCH_NAME}"

#!/usr/bin/env bash

MAJOR=$1
MINOR=$2
PATCH=$3

PATCH_NAME=v$MAJOR.$MINOR.$PATCH
MINOR_NAME=v$MAJOR.$MINOR
MAJOR_NAME=v$MAJOR

git push origin :"$MINOR_NAME"
git push origin :"$MAJOR_NAME"

git tag -d "$MINOR_NAME"
git tag -d "$PATCH_NAME"

git tag "$MAJOR_NAME"
git tag "$MINOR_NAME"
git tag "$PATCH_NAME"

git push origin "$MAJOR_NAME"
git push origin "$MINOR_NAME"
git push origin "$PATCH_NAME"

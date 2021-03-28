#!/usr/bin/env bash

MAJOR=$1
MINOR=$2
PATCH=$3

PATCH_NAME=v${MAJOR}.${MINOR}.${PATCH}
MINOR_NAME=v${MAJOR}.${MINOR}
MAJOR_NAME=v${MAJOR}

git push origin :"${MINOR}_NAME"
git push origin :"${MAJOR}_NAME"

git tag -d "${MINOR}_NAME"
git tag -d "${PATCH}_NAME"

git tag "${MAJOR}_NAME"
git tag "${MINOR}_NAME"
git tag "${PATCH}_NAME"

git push origin "${MAJOR}_NAME"
git push origin "${MINOR}_NAME"
git push origin "${PATCH}_NAME"

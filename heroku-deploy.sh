#!/usr/bin/env bash

# exit when any command fails
set -e

# change the versions in package.json and build.gradle and release before running.
./gradlew clean -Pprod bootWar -x test
# Install java plugin before deploy
heroku plugins:install java
#heroku deploy:jar --jar build/libs/*.war --includes newrelic.jar:newrelic.yml
heroku deploy:jar  build/libs/*.war --app health-by-points-yep

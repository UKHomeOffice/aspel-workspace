# asl-data-exports

A background service to generate large data exports and save them to Amazon S3.

## Running tests

Integration tests expect localstack to be running and configured with the asl-dev bucket when executed locally. The 
easiest way to get this setup correctly is the docker compose configuration in [asl-conductor](
https://github.com/UKHomeOffice/asl-conductor/).

In Drone CI, localstack is started and configured before tests are run pipeline.

---
title: Monitoring and alerting
order: 50
---

* Table of contents
{:toc}

## System metrics

A dashboard of system metrics for the production namespace is available in Sysdig.

[Sysdig dashboard](https://sysdig.digital.homeoffice.gov.uk/#/dashboards/1298?last=21600&scope=kubernetes.namespace.name%20%3D%20%22asl-prod%22)

## Error alerting

All 500 range errors in the service containers push a custom statsd event to Sysdig, which in turn triggers an alert into the `#developers` channel of the "ASL Marvell".

There is a [saved search in the ACP Opensearch instance](https://opensearch-prod.acp.homeoffice.gov.uk/app/discover#/view/291b6010-a9fe-11ec-8759-25e3974b9b7e) which will filter the logs to only those relating to error alerts.

## Service status monitoring

There is a statuscake monitoring service which hits the [public UI healthcheck endpoint](https://external.aspel.homeoffice.gov.uk/healthcheck) and alerts of any downtime into the `#developers` channel of the "ASL Marvell" slack instance.

## SSL certificate validity

There is an additional statuscake monitoring service which checks for the certificate validity of the public facing web services and reports into Slack as described above if any are due to expire in the near future.

---
title: Maintenance tasks
order: 50
---

* Table of contents
{:toc}

## Annual licence fees

Each financial year the licence fees should be defined in [https://github.com/UKHomeOffice/asl-constants/blob/master/constants/fees.js](https://github.com/UKHomeOffice/asl-constants/blob/master/constants/fees.js)

This should generally be performed before the end of the previous financial year in April.

## Bank holidays

Bank holidays should be defined as far into the future as possible in [https://github.com/UKHomeOffice/asl-constants/blob/master/constants/bank-holidays.js](https://github.com/UKHomeOffice/asl-constants/blob/master/constants/bank-holidays.js).

Since the bank holidays are used to set task processing deadlines, which can be up to 55 working days, the bank holidays for the following year should be updated by mid-October of the previous year.

## Version updates

The [baseline docker images](./building-and-deploying.html#docker-images) for each service should be periodically updated to the lastest Node LTS version according to their support timelines.

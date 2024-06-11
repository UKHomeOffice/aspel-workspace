---
title: Users and permissions
order: 10
---

* Table of contents
{:toc}

## New users

All new users need to register an account in keycloak before using the service. This can be done using the register link at the bottom of the login page.

Once they have registered they will receive an email to confirm they have access to the email address provided.

Once they user has confirmed their email address a new profile will be created for the user, or if an existing profile is located with that email address (if related licences were migrated from the previous instance of ASPeL) then the profile will be associated with the user.

## Internal and external users

Users of ASPeL fall into two categories:

* **internal users** - working within the Home Office/ASRU
* **external users** - working within licensed establishments

Internal users can access all data within the system from all establishments and (depending on the exact roles held) are responsible for reviewing and granting licence applications.

External users can only access data from establishments to which they are affiliated. This requires them to be invited to join the establishment by an admin user at the establishment.

## Establishment permissions

When inviting a user to an establishment an admin can set one of 3 permission levels:

* **admin** - allows the user full read and write access to all licence data held by the establishment, as well as the ability to add and remove users to/from the establishment and change user's permission levels.
* **intermediate** - allows the user full read-only access to all licence data held by the establishment, as well as access to their own licences.
* **basic** - allows the user only access to the high level establishment licence information, as well as access to their own licences.

In addition the these, an existing user can also be removed entirely from an establishment if they hold no licences or named roles at that establishment.

An establishment user who does hold licences or roles can also be temporarily blocked from accessing the establishment. This is generally limited to instances of conflict resolution, or for active non-compliance cases that are being investigated.

## ASRU roles

If a profile has no establishment affiliations then it can be set to be an internal ASRU profile.

All ASRU users can access all[^1] establishment and licence data within the system.

A number of additional roles are available to be assigned to users allowing them to perform specific actions. An ASRU user may hold none, some or all of the following roles:

* **inspector** - allows user to grant all licence applications and amendments
* **licensing officer** - allows user to grant PIL applications and amendments
* **admin** - allows user to add new users to ASRU and assign roles to users
* **business support** - allows user to modify the billable status of PILs
* **ROPs analyst** - allows access to aggregated ROPs data

## Notes

[^1]: the exception is ROPs data, which is only available in its aggregated form to users with the ROPs analyst role.

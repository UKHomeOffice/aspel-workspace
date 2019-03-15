# asl-emailer

## About

API server for sending HO Branded emails.

## Usage

To run a local instance:

```
npm run dev
```

The service will now be running on `http://localhost:8080` unless the PORT environment variable has been configured.

To render an email, send a POST request to the address of the service including the name of the template you require.

### Params

The following params should be included in the body of every request:

* `to` - the email address the email will be sent to
* `subject` - the subject of the email

Any extra params in the body will be passed to the template on render.

* `invitation` - `POST http://localhost:8080/invitation` - template for sending invitations to new ASL system users. Required params:
  - `name` - the name of the recipient
  - `acceptLink` - the link they click to accept the invitation.

*  `notification_other.html` - `POST http://localhost:8080/notification_other` - template for 'licence granting and application progress events' email notifications for the applicant/initiator of the amendment, AND for inspectors/HOLCs/Licensing officers/Other interested parties. Required params:
  - `taskType` - one of PPL application, PPL amendment, PIL application, PIL amendment, PEL amendment
  - `name` - name of the recipient
  - `identifier` - one of Project name, Applicant name, Licence holder name, Establishment name
  - `identifierValue` - one of projectName, applicantName, licenceHolderName, establishmentName
  - `prevStatus` - previous status of the application/amendment
  - `newStatus` - new status of the application/amendment
  - `url` - application/amendment url

*  `notification_action.html` - `POST http://localhost:8080/notification_action` - template for 'licence granting and application progress events' email notifications for the user who needs to take action. Required params:
  - `taskType` - one of PPL application, PPL amendment, PIL application, PIL amendment, PEL amendment
  - `name` - name of the recipient
  - `identifier` - one of Project name, Applicant name, Licence holder name, Establishment name
  - `identifierValue` - one of projectName, applicantName, licenceHolderName, establishmentName
  - `url` - application/amendment url

## Dependencies

* `@asl/service/ui` provides the common ui boilerplate

## Configuration

The service can be configured for local development by setting environment variables in a `.env` file.

The following environment variables are required:

* `EMAIL_FROM_ADDRESS` - the sender/reply address for your emails
* `EMAIL_ACCESS_KEY` - AWS accessKeyId for your SES account
* `EMAIL_SECRET` - AWS secretAccessKey for your SES account
* `EMAIL_REGION` - AWS region for your SES account

The following environment variables can be optionally defined:

* `PORT` - port that the service will listen on - default `8080`

## Connected services

### Upstream

* `asl-resolver` - resolves change requests, notifies users of changes

### Downstream

The following services must be available in order to run:

* `SES` - An AWS SES account needs to be configured.

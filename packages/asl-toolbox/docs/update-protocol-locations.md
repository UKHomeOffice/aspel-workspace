# Update protocol locations

In licence version data, each protocol has a list of locations where they are licenced to be carried out. These are 
stored as text. There have been historic issues where a valid location has been renamed or removed, but the update has
not been cascaded to the protocol locations. When this happens the user can't remove the incorrect name, as they only
see checkboxes for the currently valid locations for that protocol, but the old name is still visible in read-only views
of the licence. See [ASL-4636](https://collaboration.homeoffice.gov.uk/jira/browse/ASL-4636)
and [ASL-4717](https://collaboration.homeoffice.gov.uk/jira/browse/ASL-4717). There is a runbook for using this script
in confluence [Resolve deleted and renamed protocol locations](
https://collaboration.homeoffice.gov.uk/display/ASPEL/Resolve+deleted+and+renamed+protocol+locations).

## Usage

This can be run in ASPeL namespaces by executing a shell into an asl-toolbox instance.

```sh
./update-protocol-locations.js [opts]
```

| Argument                   | Description                                                                                                               |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `--current=<location>`     | The location shown in the versions' protocols that should be removed or renamed (required)                                |
| `--project-version=<uuid>` | If provided, this specific version will be updated                                                                        |
| `--project=<uuid>`         | If provided, this all versions for this project licence will be updated                                                   |
| `--establishment=<id>`     | If provided, all project versions at this establishment will be updated                                                   |
| `--replace=<location>`     | If provided, the current location will be replaced with this when found. Otherwise, the current location will be removed. |
| `--help`                   | Display this help message                                                                                                 |                                                    

One of project-version, project, or establishment MUST be provided. If multiple are provided, project-version will be
used if provided, otherwise project, and finally establishment.

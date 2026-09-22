import React from 'react';
import ReactMarkdown from 'react-markdown';

const content = `# Accessibility statement for ASPeL

This accessibility statement applies to the Animals in Science e-Licensing (ASPeL) system.

This system is run by the Home Office. We want as many people as possible to be able to use the system. For example,
that means you should be able to:

 * change colours, contrast levels and fonts
 * zoom in up to 400% without the text disappearing off the screen
 * navigate most of the system using just a keyboard
 * navigate most of the system using speech recognition software
 * listen to most of the system using a screen reader

We’ve also made the system text as simple as possible to understand.

[AbilityNet](https://mcmw.abilitynet.org.uk) has advice on making your device easier to use if you have a disability.

## How accessible this system is

We know some parts of this system are not fully accessible. You can see a full list of any issues we currently know
about in the ‘Non-accessible content’ section of this statement.

## Feedback and contact information

If you need information from this system in a different format, or if you need to apply for or amend a licence but are
unable to use this site, then contact us and we will make alternative arrangements:

 * [aspeltechnicalqueries@homeoffice.gov.uk](mailto:aspeltechnicalqueries@homeoffice.gov.uk)

Please note, our working hours are Monday to Friday, 9am to 5pm, excluding bank holidays. We’ll consider your request
and get back to you in 3 working days.

## Reporting accessibility problems with this system

We’re always looking to improve the accessibility of this system. If you find any problems not listed on this page or
think we’re not meeting accessibility requirements, you can report this to us:

 * [aspeltechnicalqueries@homeoffice.gov.uk](mailto:aspeltechnicalqueries@homeoffice.gov.uk)

Please note, our working hours are Monday to Friday, 9am to 5pm, excluding bank holidays. We’ll consider your request
and get back to you in 3 working days.

## Enforcement procedure

The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and
Mobile Applications) (No. 2) Accessibility Regulations 2018 (the ‘accessibility regulations’).

If you’re not happy with how we respond to your complaint, [contact the Equality Advisory and Support Service
(EASS)](https://www.equalityadvisoryservice.com).

## Technical information about this website’s accessibility

The Home Office is committed to making its websites accessible, in accordance with the Public Sector Bodies (Websites
and Mobile Applications) (No. 2) Accessibility Regulations 2018.

### Compliance status

This website is partially compliant with the [Web Content Accessibility Guidelines version
2.2](https://www.w3.org/TR/WCAG22) AA standard, due to the non-compliances listed below.

## Non-accessible content

The content listed below is non-accessible for the following reasons.

### Non-compliance with the accessibility regulations - external user screens

#### 1. Tabs are not programmatically defined

Tabs in the ‘Project overview’ and ‘Application overview’ screens are not programmatically defined as tabs, so
assistive technologies cannot interpret the page structure correctly.

These fail WCAG 2.2 success criteria 1.3.1: Info and Relationships (Level A).

#### 2. Empty form labels

The following fields have empty labels associated with them:

 * in the project licence application, the ‘Key words that describe this project' fields in the 'Aims' section
 * on the ‘Estimated licence fees’ screen, the ‘Covering the financial year’ field
 * in the category E PIL application flow, the ‘Animals to be used’ fields on the ‘Create new course’ screen

This means that assistive technologies cannot read these.

These fail WCAG 2.2 success criteria:

 * 1.3.1: Info and Relationships (Level A)
 * 2.4.6: Headings and Labels (Level AA) (if labels exist but are unclear or non-descriptive)
 * 3.3.2: Labels or Instructions (Level A) (because form inputs do not have labels or instructions that describe what
   information is required)

#### 3. Layout reflows

In the project application summary view, the text and horizontal scroll overlaps when magnifying the page up to 400%.
Content should reflow and not be cut off or omitted entirely when magnified.

This fails WCAG 2.2 success criteria 1.4.10: Reflow (Level AA).

#### 4. Lists inappropriately marked up as tables

The project licence application overview uses tables instead of lists. This can introduce reading and navigation order
issues, and screen readers may interpret them as data tables.

This fails WCAG 2.2 success criteria:

 * 1.3.1: Info and Relationships (Level A)
 * 4.1.2: Name, Role, Value (Level A)

#### 5. Links go blank on keyboard tabbing

In the ‘Personal licence’ screen, the ‘Amend licence’ and ‘Reapply for licence’ button links go blank when they
receive keyboard focus. This makes the button text impossible to see.

This fails WCAG 2.2 success criteria:

 * 1.4.3: Contrast (Minimum)
 * 2.4.6: Headings and Labels (Level AA)

#### 6. Missing group labels (legends)

The following issues have been identified:

 * in the project licence application, the checkbox field ‘This section is complete’ has a missing group label
 * in all project licence application sections, the ‘Create new course' screen has missing group labels for ‘Small
   animals’, ‘Large animals’, ‘Fish, reptiles and aquatic species’, ‘Birds’, ‘Cats, dogs and equidae’, ‘Non-human
   primates’, and ‘Other’
 * on the person’s training screen, under ‘Do you want to add a training certificate...’, there are empty Heading 2
   elements with no content just before the ‘training certificate' and ‘exemption’ radio buttons

Assistive technologies cannot read these because the programmatic relationship between the field(s) in each fieldset
and their group label is missing.

This fails WCAG 2.2 success criteria 1.3.1: Info and Relationships (Level A).

#### 7. Redundant fieldsets

In the ‘Returns of procedures’ screens, the ‘Reporting period’ field has been inappropriately placed into a fieldset
which does not group related fields, so assistive technologies cannot interpret this correctly.

This fails WCAG 2.2 success criteria 1.3.1: Info and Relationships (Level A).

#### 8. Not enough contrast between text and background

In the project licence application screens, pink and grey change flags do not have enough contrast. The low contrast
makes the text difficult to see.

This fails WCAG 2.2 success criteria 1.4.3: Contrast (Minimum).

#### 9. Text inappropriately marked up as headings

In the Establishment screen for ‘Approved areas’, some text that does not title any page content has been marked up
incorrectly as headings (Heading 1 elements). This will cause confusion about the page structure for users of
assistive technology.

This fails WCAG 2.2 success criteria 1.3.1: Info and Relationships (Level A).

#### 10. Error identification

When submitting incorrect data or a blank form field, error messages are not associated with the fields they relate to.

Screen readers may not communicate the error message.

This fails WCAG 2.2 success criterion 1.3.1: Info and Relationships (Level A).

#### 11. Timing adjustable

When a timeout occurs as a result of user inactivity (of more than 10 minutes), the user is logged out of the project
application without any timeout warning.

This fails WCAG 2.2 success criterion 2.2.1: Timing Adjustable (Level A).

#### 12. Form labels and instructions

Across ASPeL, instructional and validation text for input fields - for example dates - are not programmatically
associated with the relevant form fields. As a result, assistive technologies do not announce this information when the
field receives keyboard focus.

This fails WCAG 2.2 success criteria 1.3.1: Info and Relationships (Level A).

#### 13. Screen titles

Screens do not have unique or descriptive titles.

All project licence pages use the same screen title ‘Research and testing using animals’, which does not describe the
specific content or purpose of each page. This makes it difficult for users to identify where they are in the service.

This fails WCAG 2.2 success criterion 2.4.2: Page Titled (Level A).

### Non-compliance with the accessibility regulations - administrative screens (not available to external users)

#### 1. Empty form labels

On the task list search screen, the checkbox fields to filter ‘By status’ and ‘By category’ have empty labels
associated with them. This means that assistive technologies cannot read these.

These fail WCAG 2.2 success criteria:

 * 1.3.1: Info and Relationships (Level A)
 * 2.4.6: Headings and Labels (Level AA) (if labels exist but are unclear or non-descriptive)
 * 3.3.2: Labels or Instructions (Level A) (because form inputs do not have labels or instructions that describe what
   information is required)

#### 2. Missing legends

On the project licence application task screen, the ‘Task assignment’ section has an empty Heading 2 element with no
content.

Assistive technologies cannot interpret the page structure correctly because the programmatic relationship between the
field(s) in each fieldset and their group label (legend) is missing.

This fails WCAG 2.2 success criteria 1.3.1: Info and Relationships (Level A).

#### 3. Redundant fieldsets

On the project licence application task screen, the ‘Assign to’ field has been inappropriately placed into a fieldset
which does not group related fields, so assistive technologies cannot interpret this correctly.

This fails WCAG 2.2 success criteria 1.3.1: Info and Relationships (Level A).

## What we are doing to improve accessibility

We have an active accessibility backlog and a WCAG 2.2 conformance plan in place. Issues are prioritised based on
their impact on users and are being addressed through:

 * design pattern improvements (headings, group labels and field labels)
 * code level fixes to prevent empty headings and legends from being rendered
 * improvements to error handling and form validation
 * regular accessibility testing against WCAG 2.2 AA

Where possible, fixes are released incrementally to reduce barriers for users as quickly as possible.

## Preparation of this accessibility statement

This statement was prepared on 24 June 2026. It was last reviewed on 24 June 2026.

This system was last tested on 31 March 2026 against the WCAG 2.2 AA standard.

Testing was carried out internally by the Home Office. We tested the service based on a user's ability to apply for
and manage their licences. We also tested the application assessment and granting processes.
`;

export default () => {
  return <ReactMarkdown escapeHtml={false}>{ content }</ReactMarkdown>;
};

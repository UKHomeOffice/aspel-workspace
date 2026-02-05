# Protocol Schema Field Reference

## Complete Field Value Types Reference

### 1. Protocol Metadata Fields

| Field Name | Type | Conditional Logic | Example Values | Notes |
|------------|------|-------------------|----------------|-------|
| `id` | string | Always required | `'protocol-001'`, `'p-abc123'` | Unique identifier |
| `title` | string | Always required | `'Mouse Breeding Protocol'` | Protocol title from top-level field |
| `isStandardProtocol` | boolean | Determines field rendering | `true`, `false` | If `true`: uses paragraph fields, if `false`: uses texteditor |
| `standardProtocolType` | string | Required if `isStandardProtocol=true` | `'ga-breeding'`, `''` | Empty string for non-standard |

---

### 2. Protocol Details Section

| Field Name | Type | Conditional Logic | Example Values | Field Type Based on Protocol Type |
|------------|------|-------------------|----------------|-----------------------------------|
| `description` | string | Always required | `'Breeding of GA mice...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `severity` | string | Required | `'mild'`, `'moderate'`, `'severe'`, `'non-recovery'` | Always `radio` |
| `severity-proportion` | string | Required | `'10%'`, `'Approx. 20 animals'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `severity-details` | string | Required | `'Justification for severity...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `locations` | array of objects | Required | `[{establishmentId: 'est1', poles: ['A']}]` | Always `location-selector` |
| `objectives` | array of strings | Required | `['obj-1', 'obj-2']` | Always `objective-selector` |
| `training-used-for` | array of strings | Only if `isTrainingLicence(values)` | `['demonstration']`, `['tissue-provision']` | Always `checkbox` |
| `training-responsible-for-animals` | string | Only if `isTrainingLicence(values)` | `'Licensed technicians...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `training-regulated-procedures` | boolean | Only if `isTrainingLicence(values)` | `true`, `false` | Always `radio` |
| `training-regulated-procedures-type-of-pil` | string | Only if `training-regulated-procedures=true` | `'A, B'`, `'A, B, C'`, `'E'` | Always `radio` |
| `training-participant-pre-course-training` | string | Only if `isTrainingLicence(values)` | `'Complete modules 1-4...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |

---

### 3. Animals Section (Repeats for each species)

*Each speciesDetail object can have these fields:*

| Field Name | Type | Conditional Logic | Example Values | Field Type Based on Protocol Type |
|------------|------|-------------------|----------------|-----------------------------------|
| `species` | array of strings | Required | `['mice']`, `['rats', 'rabbits']` | Always `checkbox` |
| `speciesLabel` | string | Derived from `species` | `'mice'`, `'rats and rabbits'` | Not a form field |
| `maximum-animals` | string | Required | `'500'`, `'120'` (numeric string) | **Standard**: `paragraph`<br>**Regular**: `text` |
| `life-stages` | array of strings | Required | `['adult']`, `['embryo', 'neonate']` | Always `checkbox` |
| `continued-use` | boolean | Required | `true`, `false` | Always `radio` |
| `continued-use-sourced` | string | Only if `continued-use=true` | `'Animals from previous protocol...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `reuse` | array of strings | Required, exclusive options | `['other-protocol']`, `['this-protocol']`, `['no']` | Always `checkbox` |
| `reuse-details` | string | Only if `reuse.includes('other-protocol')` | `'Description of reuse...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `maximum-times-used` | string | Only if `reuse.includes('this-protocol')` | `'3'`, `'5'` (numeric string) | **Standard**: `paragraph`<br>**Regular**: `text` |

---

### 4. GAA Section

| Field Name | Type | Conditional Logic | Example Values | Field Type Based on Protocol Type |
|------------|------|-------------------|----------------|-----------------------------------|
| `gaas` | boolean | Required | `true`, `false` | Always `radio` |
| `gaas-types` | string | Only if `gaas=true` | `'Cre-LoxP knockout mice...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `gaas-harmful` | boolean | Only if `gaas=true` | `true`, `false` | Always `radio` |
| `gaas-harmful-justification` | string | Only if `gaas-harmful=true` | `'Harmful phenotype is necessary...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `gaas-harmful-control` | string | Only if `gaas-harmful=true` | `'Control measures include...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |

---

### 5. Steps Section (Repeats for each step)

*Each step object can have these fields:*

| Field Name | Type | Conditional Logic | Example Values | Field Type Based on Protocol Type |
|------------|------|-------------------|----------------|-----------------------------------|
| `title` | string | Required | `'Blood sampling procedure'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `reference` | string | Only if `!readonly` | `'Blood sampling'`, `'Dosing'` | **Standard**: `paragraph`<br>**Regular**: `text` |
| `optional` | boolean | Required | `true`, `false` | Always `radio` |
| `adverse` | boolean | Required | `true`, `false` | Always `radio` |
| `adverse-effects` | string | Only if `adverse=true` | `'Potential adverse effects...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `prevent-adverse-effects` | string | Only if `adverse=true` | `'Monitoring and control measures...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `endpoints` | string | Only if `adverse=true` | `'Humane endpoints include...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `reusable` | boolean | Only if `!readonly` | `true`, `false` | Always `radio` |

---

### 6. Fate of Animals Section

| Field Name | Type | Conditional Logic | Example Values | Field Type |
|------------|------|-------------------|----------------|------------|
| `fate` | array of strings | Required, based on NTS selections | `['killed']`, `['tissue-taken', 'bred-for-use']` | Always `checkbox` |

---

### 7. Animal Experience Section

| Field Name | Type | Conditional Logic | Example Values | Field Type Based on Protocol Type |
|------------|------|-------------------|----------------|-----------------------------------|
| `experience-summary` | string | Required | `'Typical animal experience...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `experience-endpoints` | string | Required | `'General humane endpoints...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |

---

### 8. Experimental Design Section

| Field Name | Type | Conditional Logic | Example Values | Field Type Based on Protocol Type |
|------------|------|-------------------|----------------|-----------------------------------|
| `outputs` | string | Only if `!isTrainingLicence(values)` | `'Efficacy data, growth curves...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `training-outputs` | string | Only if `isTrainingLicence(values)` | `'Learning outcomes include...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `quantitative-data` | boolean | Required | `true`, `false` | Always `radio` |
| `quantitative-data-guideline` | boolean | Only if `quantitative-data=true` | `true`, `false` | Always `radio` |
| `quantitative-data-guideline-refined` | string | Only if `quantitative-data-guideline=true` | `'Ensure refinement by...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `quantitative-data-pilot-studies-how` | string | Only if `quantitative-data-guideline=false` | `'Pilot studies will be used...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `quantitative-data-experimental-groups` | string | Only if `quantitative-data-guideline=false` | `'Groups: control, low/med/high dose...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `control-groups` | string | Only if `quantitative-data-guideline=false` | `'Control group receives vehicle...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `randomised` | string | Only if `quantitative-data-guideline=false` | `'Randomisation using computer...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `reproducibility` | string | Only if `quantitative-data-guideline=false` | `'Standardized procedures...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `control-groups-size` | string | Only if `quantitative-data-guideline=false` | `'Based on power calculation...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `maximize-effectiveness` | string | Only if `quantitative-data-guideline=false` | `'Multiple endpoints analyzed...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |

---

### 9. Protocol Justification Section

| Field Name | Type | Conditional Logic | Example Values | Field Type Based on Protocol Type |
|------------|------|-------------------|----------------|-----------------------------------|
| `most-appropriate` | string | Required | `'Mouse model is standard...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `most-refined` | string | Required | `'Using minimum numbers...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `scientific-endpoints` | string | Required | `'Clinical signs needed to assess...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `scientific-suffering` | string | Required | `'Suffering necessary for...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `scientific-endpoints-justification` | string | Required | `'Earlier endpoints would prevent...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `justification-substances` | boolean | Required | `true`, `false` | Always `radio` |
| `substances-suitibility` | string | Only if `justification-substances=true` | `'Assessed for sterility, toxicity...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |
| `dosing-regimen` | string | Only if `justification-substances=true` | `'50mg/kg daily IP for 14 days...'` | **Standard**: `paragraph`<br>**Regular**: `texteditor` |

---

### 10. Additional Protocol State Fields

| Field Name | Type | Conditional Logic | Example Values | Notes |
|------------|------|-------------------|----------------|-------|
| `deleted` | boolean | Only shown in review if in `previousProtocols.showDeleted` | `true`, `false` | Soft delete flag |
| `complete` | boolean | UI state | `true`, `false` | Form completion status |
| `speciesDetails` | array | Always present, can be empty | `[]`, `[{...species object}]` | Array of species detail objects |
| `steps` | array | Always present, can be empty | `[]`, `[{...step object}]` | Array of step objects |

---

## Field Type Mapping Reference

### Based on `isStandardProtocol`:

| Field Name | Standard Protocol Type | Regular Protocol Type |
|------------|------------------------|-----------------------|
| Text content fields (`description`, `severity-proportion`, etc.) | `paragraph` (read-only display) | `texteditor` (rich text editor) |
| Numeric fields (`maximum-animals`, `maximum-times-used`) | `paragraph` (read-only display) | `text` (input field) |
| Step `reference` field | `paragraph` (read-only display) | `text` (input field) |
| All selection fields (`severity`, `species`, `life-stages`, etc.) | Same as regular (no change) | Same as standard (no change) |

---

### Conditional Display Logic:

| Condition | Applies To Fields |
|-----------|-------------------|
| `isTrainingLicence(values)` | `training-used-for`, `training-responsible-for-animals`, `training-regulated-procedures`, `training-participant-pre-course-training`, `training-outputs` |
| `!isTrainingLicence(values)` | `outputs` |
| `props.isGranted && !props.isFullApplication` | `purpose`, `establishments`, `objectives` sections visibility |
| `!isGranted || isFullApplication` | `fate` section visibility |
| `!props.readonly` | Step `reference`, `reusable` fields |
| `props.showConditions` | `conditions`, `authorisations` sections visibility |
| Boolean reveals (`continued-use=true`, `gaas=true`, etc.) | Respective reveal fields |

---

## Field Value Validation Rules

| Field Type | Validation Rules | Examples |
|------------|-----------------|----------|
| `text` (numeric) | Must contain only numerals | `'500'`, `'120'` (not `'five hundred'`) |
| `radio` | Must select exactly one option | `'mild'`, `true`, `false` |
| `checkbox` | Can select multiple (except exclusive) | `['adult', 'pregnant']`, `['other-protocol']` |
| `location-selector` | Array of objects with required properties | `[{establishmentId, poles}]` |
| `objective-selector` | Array of valid objective IDs | `['obj-001', 'obj-002']` |
| `texteditor`/`paragraph` | Non-empty string | Min length validation may apply |

---

## Special Field Patterns

### Dynamic Label Fields:
- `maximum-animals`: Uses `{{ values.speciesLabel }}` placeholder
- `continued-use`: Uses `{{ values.speciesLabel }}` placeholder
- `reuse`: Uses `{{ values.speciesLabel }}` placeholder

### Reveal Pattern Fields:
```javascript
// Pattern: Boolean field with reveal property
{
  name: 'field-name',
  type: 'radio',
  options: [
    {
      label: 'Yes',
      value: true,
      reveal: { /* nested field(s) */ }
    },
    {
      label: 'No',
      value: false
    }
  ]
}

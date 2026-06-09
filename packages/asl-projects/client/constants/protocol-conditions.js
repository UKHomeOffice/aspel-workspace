const { markdownLink } = require('../helpers');

const legacy = {
  title: 'General constraints',

  summary: `Please note, constraints on procedures involving anaesthesia, surgery, substance administration and withdrawal of fluids apply to all protocols.`,

  anaesthesia: `### Anaesthesia

Induction and maintenance of general or local anaesthesia, sedation or analgesia to mitigate the pain, suffering or distress associated with the performance of other regulated procedures is indicated using the following codes in protocols:
* AA no anaesthesia
* ABL local anaesthesia
* AB general anaesthesia with recovery
* AC non-recovery general anaesthesia
* AD under neuromuscular blockade`,

  generalAnaesthesia: `### General anaesthesia

If authorised in this licence and unless otherwise specified, all animals are expected to make a rapid and unremarkable recovery from the anaesthetic within two hours. Uncommonly animals that fail to do so or exhibit signs of pain, distress or of significant ill health should be humanely killed unless a programme of enhanced monitoring and care is instituted until the animal fully recovers.`,

  surgery: `### Surgery

If authorised in this licence and unless otherwise specified:
* Surgical procedures should be carried out aseptically, to at least the published Home Office minimum;
* In the uncommon event of post-operative complications, animals will be humanely killed unless, in the opinion of a veterinary surgeon, such complications can be remedied promptly and successfully using no more than minor interventions. Minimally inflamed wounds without obvious infection may be re-closed on one occasion within 48 hours of the initial surgery. In the event of recurrence, NVS advice will be followed;
* Peri and post-operative analgesia will be provided; agents will be administered as agreed in advance with the NVS;
* All animals are expected to make a rapid and unremarkable recovery from the anaesthetic within two hours. Uncommonly animals that fail to do so or exhibit signs of pain, distress or of significant ill health will be humanely killed by a Schedule 1 method unless a programme of enhanced monitoring and care is instituted until the animal fully recovers;
* Any animal not fully recovered from the surgical procedure within 24 hrs (eating, drinking and return to normal behaviour) should be humanely killed.`,

  administration: `### Administration of substances and withdrawal of fluids

If authorised in this licence and unless otherwise specified, administration of substances and withdrawal of body fluids will be undertaken using a combination of volumes, routes, and frequencies that of themselves will result in no more than transient discomfort and no lasting harm using published guidelines on minimal severity.`
};

const standardProtocol = {
  title: 'General constraints',

  summary: `The general constraints apply to all protocols in this licence where these regulated procedures are authorised, unless otherwise specified in the protocol.

\n They are automatically added to all licences.`,

  anaesthesia: `## Anaesthesia

Where general or local anaesthesia, sedation or analgesia will be used to mitigate the adverse effects of regulated procedures, this is indicated in the protocols using the following codes: \n
* AA: no anaesthesia
* ABL: local anaesthesia
* AB: general anaesthesia with recovery
* AC: non-recovery general anaesthesia
* AD: under neuromuscular blockade`,

  generalAnaesthesia: `### General anaesthesia

All animals are expected to make a rapid and unremarkable recovery from an anaesthetic within 2 hours.

\n However, animals which do not fully recover or show signs of pain, distress or significant ill health will be killed - unless they receive enhanced monitoring and care until they fully recover.`,

  surgery: `## Surgery

Surgical procedures will be carried out aseptically in line with best practice guidelines, for example ${markdownLink('Guiding principles for preparing for and undertaking aseptic surgery ', 'https://lasa.co.uk/wp-content/uploads/2018/05/Aseptic-Surgery.pdf')} (Laboratory Animal Science Association, 2017)

\n Minimally inflamed wounds without obvious infection may only be reclosed once. If there are concerns about wounds healing, NVS advice will be followed.

\n Pre-, peri and post-operative analgesia will be provided. Intra-operative fluids and thermal support may be administered, as agreed in advance with the NVS.

\n Animals will be killed:

* if they experience post-operative complications which cannot be resolved with minor interventions
* if they do not fully recover from the anaesthetic within 2 hours or show signs of pain, distress or significant ill health - unless they receive enhanced monitoring and care until they fully recover
* if they do not fully recover from the surgical procedure within 24 hours (eating, drinking and returning to normal behaviour)`,

  administration: `## Administration of substances and withdrawal of fluids

When administering substances and withdrawing body fluids, we will use a combination of volumes, routes, frequencies and durations that will result in no more than mild short-term pain, suffering or distress and no lasting harm.

\n The protocol steps include (in the 'Adverse effects' section):\n
* adverse effects related to the substance itself
* potential adverse effects and humane endpoints for non-standard administration routes and/or volumes

\n We will follow best practice guidelines. We may follow our own establishment guidelines if they are as refined or more refined than the best practice guidelines.

\n Unless justified in the protocol, blood samples will not exceed: \n
* 10% of total blood volume (TBV) in a 24-hour period
* 15% TBV in a 28-day period`
};

module.exports = {
  ...legacy,
  variants: {
    default: legacy,
    standardProtocol
  }
};

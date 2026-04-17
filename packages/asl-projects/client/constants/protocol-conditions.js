const { markdownLink } = require('../helpers');
module.exports = {
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

Surgical procedures will be carried out aseptically in line with best practice guidelines, for example Guiding principles for preparing for and undertaking aseptic surgery ${markdownLink('Laboratory Animal Science Association, 2017', 'https://lasa.co.uk/wp-content/uploads/2018/05/Aseptic-Surgery.pdf')}

\n Minimally inflamed wounds without obvious infection may only be reclosed once. If there are concerns about wounds healing, NVS advice will be followed.

\n Pre-, peri and post-operative analgesia will be provided. Intra-operative fluids and thermal support may be administered, as agreed in advance with the NVS.

\n Animals will be killed:

* if they experience post-operative complications which cannot be resolved with minor interventions
* if they do not fully recover from the anaesthetic within 2 hours or show signs of pain, distress or significant ill health - unless they receive enhanced monitoring and care until they fully recover
* if they do not fully recover from the surgical procedure within 24 hours (eating, drinking and returning to normal behaviour)`,

  administration: `## Administration of substances and withdrawal of fluids

When administering substances and withdrawing body fluids, we will use a combination of volumes, routes, frequencies and durations that will result in no more than mild short-term pain, suffering or distress and no lasting harm.

\n The protocol steps include (in the ‘Adverse effects’ section):\n
* adverse effects related to the substance itself
* potential adverse effects and humane endpoints for non-standard administration routes and/or volumes

\n We will follow best practice guidelines. We may follow our own establishment guidelines if they are as refined or more refined than the best practice guidelines.

\n Unless justified in the protocol, blood samples will not exceed: \n

* 10% of total blood volume (TBV) in a 24-hour period
* 15% TBV in a 28-day period`
};

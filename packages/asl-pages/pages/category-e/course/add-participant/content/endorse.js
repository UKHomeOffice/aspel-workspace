const { merge } = require('lodash');
const baseContent = require('./base');

module.exports = merge(
  {},
  baseContent,
  {
    title: 'Endorse category E PIL application',
    fields: {
      comments: {
        label: 'Comments (optional)',
        hint: 'Your comments will be recorded and visible to relevant establishment and Home Office staff'
      }
    },
    declaration: {
      title: 'Declaration',
      content: `\
By endorsing this application, I confirm that:

* {{model.firstName}} {{model.lastName}} will have completed the mandatory law and ethics training before they carry out any procedures on
 animals, by either of the following:
 
    * completing modules L and E1 (or having grounds for an exemption)
    
    * covering the L and E1 learning outcomes as part of their course
    
* I have the delegated authority of the establishment licence (PEL) holder

* The PEL holder is aware they will be liable for the cost of the licence`
    },
    buttons: {
      submit: 'Endorse application',
      cancel: 'Cancel'
    },
    notifications: {
      success: 'Licence request sent.'
    }
  }
);

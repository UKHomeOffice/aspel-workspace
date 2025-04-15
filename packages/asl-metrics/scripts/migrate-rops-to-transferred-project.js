const db = require('@asl/schema');
const config = require('../config');

(async () => {
  const { Project, Rop, destroy } = db(config.asldb);

  try {
    // Fetch projects with status 'transferred'
    const result = await Project.query().select('id', 'transferProjectId').where({ status: 'transferred' });
    const e1ProjectTransferred = result.map(project => ({
      E1_PROJECT_ID: project.id,
      TRANSFERRED_PROJECT_ID: project.transferProjectId
    }));

    // Count and log the results
    const count = e1ProjectTransferred.length;
    console.log('Count:', count);

    // Process each project
    for (const project of e1ProjectTransferred) {
      let e1ProjectId = project.E1_PROJECT_ID;
      let currentProjectId = project.TRANSFERRED_PROJECT_ID;

      while (currentProjectId) {
        // eNth -> final active project
        const eNth = await Project.query().select('id', 'transferProjectId').where({ id: currentProjectId }).first();

        if (!eNth) {
          console.log(`No project found with ID: ${currentProjectId}`);
          break;
        }

        console.log('Projects in process:', project);
        console.log('ENth: Projects in process:', eNth);

        // Query rops
        const e1Rops = await Rop.query().select('id', 'projectId', 'year').where({ projectId: e1ProjectId });
        console.log('E1 ROPS', e1Rops);

        const eNthRops = await Rop.query().select('id', 'projectId', 'year').where({ projectId: eNth.id });
        console.log('eNth ROPS', eNthRops);
        console.log('------*******------\n');

        // Update currentProjectId to the next transferProjectId
        currentProjectId = eNth.transferProjectId;
      }
    }
  } catch (error) {
    console.error('Error processing RoPs:', error);
  } finally {
    // Close the database connection
    await destroy();
  }
})();

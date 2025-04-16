/**
 * @Usage: node migrate-rops-to-transferred-project.js
 * @description: script to migrate ROPs to the transferred project, where ROPS has duplicate year submitted at Transferred project.
 * use transferred project ROPs.
 * */
const db = require('@asl/schema');
const config = require('../config');

(async () => {
  const { Project, Rop, ProjectVersion, destroy } = db(config.asldb);

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
        const eNth = await Project.query().select('id', 'transferProjectId', 'transferredOutDate').where({ id: currentProjectId }).first();

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

        if (e1Rops.length > 0) {
          for (const e1Rop of e1Rops) {
            // Check if the year exists in eNthRops with the correct projectId
            const yearExistsInENthRops = eNthRops.some(
              eNthRop => eNthRop.year === e1Rop.year
            );

            if (!yearExistsInENthRops) {
              // Update the projectId of e1Rop to eNth.id
              await Rop.query()
                .where({ id: e1Rop.id })
                .update({ projectId: eNth.id });

              console.log(`Updated ROP with ID ${e1Rop.id} to project ID ${eNth.id}`);
            } else {
              console.log(
                `No update needed for ROP with ID ${e1Rop.id}, year ${e1Rop.year} already exists in eNthRops with the correct projectId.`
              );
            }
          }
        } else {
          console.log('No ROPs found to compare.');
        }

        // Query projectVersions, transferredOutDate is null means no more transfers
        if (eNth.transferredOutDate === null) {
          const projectVersions = await ProjectVersion.query()
            .where({project_id: e1ProjectId});
          if (projectVersions.length > 0) {
            for (const projectVersion of projectVersions) {
              await ProjectVersion.query().insert({
                ...projectVersion,
                id: undefined,
                projectId: eNth.id
              });

              console.log(`Inserted new ProjectVersion for projectId ${eNth.id} based on ProjectVersion ID ${projectVersion.id}`);
            }
          } else {
            console.log(`No ProjectVersions found for projectId ${e1ProjectId}`);
          }
        }

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

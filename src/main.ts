import * as github from '@actions/github';
import * as core from '@actions/core';
// import * as github from './push-payload.json'; // TOOD: remove after tests
import { checkPermissionToAccess } from './modules';

export async function main() {
  core.debug('Show Github context:');
  core.debug(JSON.stringify(github.context, null, 2));
  core.info(`Repository: ${github.context.payload?.repository?.full_name}`);
  core.info(`Workflow: ${github.context.workflow}`);
  core.info(`SHA: ${github.context.sha}`);
  let secretList = core.getInput('secretList').replace(/\s/g, '').split(',');
  core.debug(`secretList: ${secretList}`);

  for (const secret of secretList) {
    // Check repository
    await checkPermissionToAccess(secret);
  }

  for (const secret of secretList) {
    // Get AWS secret and set as Github secret
    core.debug(`Get secret ${secret}`);
  }
}

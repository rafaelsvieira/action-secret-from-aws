// import * as github from '@actions/github';
import * as core from '@actions/core';
import * as github from './push-payload.json'; // TOOD: remove after tests
import { checkPermissionToAccess } from './modules';

export async function main() {
  core.debug('Show Github context:');
  core.info(JSON.stringify(github.context, null, 2)); // TODO: change to debug.
  let secretList = core.getInput('secretList').replace(/\s/g, '').split(',');
  core.debug(`secretList: ${secretList}`);

  for (const secret of secretList) {
    await checkPermissionToAccess(secret);
  }

  for (const secret of secretList) {
    // TODO: Get AWS secret and set as Github secret
    core.debug(`Get secret ${secret}`);
  }
}

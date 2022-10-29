import * as github from '@actions/github';
import * as core from '@actions/core';

export async function main() {
  core.debug('Show Github context:');
  core.debug(JSON.stringify(github.context, null, 2));
  core.debug('Show inputs:');
  let secretList = core.getInput('secretList');
  core.debug(secretList);
}

main();

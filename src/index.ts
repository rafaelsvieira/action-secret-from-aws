import * as core from '@actions/core';
import { main } from './main';

async function run() {
  try {
    await main();
  } catch (error: any) {
    core.debug(`${error}`);
    core.setFailed(`${error.message}`);
  }
}

run();

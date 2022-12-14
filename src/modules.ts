import * as github from '@actions/github';
import * as core from '@actions/core';
// import * as github from './push-payload.json'; // TOOD: remove after tests
import * as permission from './permission.json';

export async function checkPermissionToAccess(secretName: string) {
  const context: any = github.context;
  const permissionObj: { [index: string]: any } = permission;

  core.debug(`Checking if repository can get secret ${secretName}`);

  if (!permissionObj[secretName])
    throw new Error(`Secret ${secretName} are not mapping.`);

  core.debug(`${secretName}: ${JSON.stringify(permissionObj[secretName])}`);

  for (const permission of permissionObj[secretName].exclude) {
    if (isSubGroup(context.repository, permission))
      throw new Error(
        `FOUND_EXCLUDE: Repository ${context.repository} don't have permission to access the secret ${secretName}.`
      );
  }

  const permissionList = permissionObj[secretName].include.filter(
    (item: string) => {
      return isSubGroup(context.repository, item);
    }
  );

  core.debug(`permissionList: ${permissionList}`);

  if (permissionList.length == 0 && !(await allowedReusable())) {
    throw new Error(
      `NOT_FOUND_INCLUDE: Repository ${context.repository} don't have permission to access the secret ${secretName}.`
    );
  }
}

async function allowedReusable() {
  core.debug(`Checking reusable`);
  return true;
}

function isSubGroup(str: string, wildcard: string) {
  let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^${w.replace(/\*/g, '.*').replace(/\?/g, '.')}$`, 'i');
  return re.test(str);
}

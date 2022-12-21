import * as github from '@actions/github';
import * as core from '@actions/core';
import * as permission from './permission.json';

export async function checkPermissionToAccess(secretName: string) {
  const repositoryName: string = github.context.repo.repo;
  const permissionObj: { [index: string]: any } = permission;

  core.debug(`Checking if repository can get secret ${secretName}`);

  if (!permissionObj[secretName])
    throw new Error(`Secret ${secretName} are not mapping.`);

  core.debug(`${secretName}: ${JSON.stringify(permissionObj[secretName])}`);

  for (const permission of permissionObj[secretName].exclude) {
    if (isSubGroup(repositoryName, permission))
      throw new Error(
        `FOUND_EXCLUDE: Repository ${repositoryName} don't have permission to access the secret ${secretName}.`
      );
  }

  const permissionList = permissionObj[secretName].include.filter(
    (item: string) => {
      return isSubGroup(repositoryName, item);
    }
  );

  core.debug(`permissionList: ${permissionList}`);

  if (permissionList.length == 0 && !(await allowedReusable())) {
    throw new Error(
      `NOT_FOUND_INCLUDE: Repository ${repositoryName} don't have permission to access the secret ${secretName}.`
    );
  }
}

async function allowedReusable() {
  // TODO: when are using reusable check if reusable can get secret.
  core.debug(`Checking reusable`);
  return false;
}

function isSubGroup(str: string, wildcard: string) {
  let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^${w.replace(/\*/g, '.*').replace(/\?/g, '.')}$`, 'i');
  return re.test(str);
}

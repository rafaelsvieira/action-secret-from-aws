var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as github from '@actions/github';
import * as core from '@actions/core';
// import * as github from './push-payload.json'; // TOOD: remove after tests
import * as permission from './permission.json';
export function checkPermissionToAccess(secretName) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = github.context;
        const permissionObj = permission;
        core.debug(`Checking if repository can get secret ${secretName}`);
        if (!permissionObj[secretName])
            throw new Error(`Secret ${secretName} are not mapping.`);
        core.debug(`${secretName}: ${JSON.stringify(permissionObj[secretName])}`);
        for (const permission of permissionObj[secretName].exclude) {
            if (isSubGroup(context.repository, permission))
                throw new Error(`FOUND_EXCLUDE: Repository ${context.repository} don't have permission to access the secret ${secretName}.`);
        }
        const permissionList = permissionObj[secretName].include.filter((item) => {
            return isSubGroup(context.repository, item);
        });
        core.debug(`permissionList: ${permissionList}`);
        if (permissionList.length == 0 && !(yield allowedReusable())) {
            throw new Error(`NOT_FOUND_INCLUDE: Repository ${context.repository} don't have permission to access the secret ${secretName}.`);
        }
    });
}
function allowedReusable() {
    return __awaiter(this, void 0, void 0, function* () {
        core.debug(`Checking reusable`);
        return true;
    });
}
function isSubGroup(str, wildcard) {
    let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^${w.replace(/\*/g, '.*').replace(/\?/g, '.')}$`, 'i');
    return re.test(str);
}

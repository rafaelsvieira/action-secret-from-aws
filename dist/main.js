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
import { checkPermissionToAccess } from './modules';
export function main() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        core.debug('Show Github context:');
        core.debug(JSON.stringify(github.context, null, 2));
        core.info(`Repository: ${(_b = (_a = github.context.payload) === null || _a === void 0 ? void 0 : _a.repository) === null || _b === void 0 ? void 0 : _b.full_name}`);
        core.info(`Workflow: ${github.context.workflow}`);
        core.info(`SHA: ${github.context.sha}`);
        let secretList = core.getInput('secretList').replace(/\s/g, '').split(',');
        core.debug(`secretList: ${secretList}`);
        for (const secret of secretList) {
            // Check repository
            yield checkPermissionToAccess(secret);
        }
        for (const secret of secretList) {
            // Get AWS secret and set as Github secret
            core.debug(`Get secret ${secret}`);
        }
    });
}

export { };

import ModuleAPI from "../moduleApi";
import ModuleParser from "../../../parser/moduleParser";
import { StatusCode } from "../../../types";
import { FAKE_ERRORS, TEST_MODULE } from "../../global/mockValues";

jest.mock("../../../parser/moduleParser");

describe('Module Api Unit Tests', () => {
    let moduleAPI: ModuleAPI;
    let parser: any;

    beforeEach(() => {
        parser = new ModuleParser();
        moduleAPI = new ModuleAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('get module (correct case)', async () => {
        if(!TEST_MODULE.accountId) throw new Error("Module Id was null!");
        parser.parseModules.mockResolvedValueOnce([
          {module_id: TEST_MODULE.id, module_name: TEST_MODULE.name, description: TEST_MODULE.description, 
                completion_percent: TEST_MODULE.completion, account_id: TEST_MODULE.accountId}
        ]);
        expect(await moduleAPI.getModules(TEST_MODULE.accountId)).toEqual([
            {module_id: TEST_MODULE.id, module_name: TEST_MODULE.name, description: TEST_MODULE.description, 
                completion_percent: TEST_MODULE.completion, account_id: TEST_MODULE.accountId}
        ]);
    });

    it('get module with coach (correct case)', async () => {
        if(!TEST_MODULE.accountId) throw new Error("Module Id was null!");
        parser.parseModules.mockResolvedValueOnce([
            {
                module_id: TEST_MODULE.id, module_name: TEST_MODULE.name, description: TEST_MODULE.description,
                completion_percent: TEST_MODULE.completion, account_id: TEST_MODULE.accountId
            }
        ]);
        expect(await moduleAPI.getModules(TEST_MODULE.accountId)).toEqual([
            {
                module_id: TEST_MODULE.id, module_name: TEST_MODULE.name, description: TEST_MODULE.description,
                completion_percent: TEST_MODULE.completion, account_id: TEST_MODULE.accountId
            }
        ]);
    });

    it('get module (network error case)', async () => {
        if(!TEST_MODULE.accountId) throw new Error("Module Id was null!");
        parser.parseModules.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await moduleAPI.getModules(TEST_MODULE.accountId)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('get module (fatal server error case)', async () => {
        if(!TEST_MODULE.accountId) throw new Error("Module Id was null!");
        parser.parseModules.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await moduleAPI.getModules(TEST_MODULE.accountId)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('create module (correct case)', async () => {
        parser.storeModule.mockResolvedValueOnce({});
        const actual = await moduleAPI.createModule({
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
            accountId: TEST_MODULE.accountId
        });
        expect(actual).toEqual(StatusCode.OK);
    });

    it('create module with coach (correct case)', async () => {
        parser.storeModule.mockResolvedValueOnce({});
        const actual = await moduleAPI.createModule({
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
            accountId: TEST_MODULE.accountId
        });
        expect(actual).toEqual(StatusCode.OK);
    });

    it('create module (primary key violation case)', async () => {
        parser.storeModule.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        var actual = await moduleAPI.createModule({
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
            accountId: TEST_MODULE.accountId
        });
        expect(actual).toEqual(StatusCode.CONFLICT);
    });

    it('create module (network error case)', async () => {
        parser.storeModule.mockRejectedValue(FAKE_ERRORS.networkError);
        var actual = await moduleAPI.createModule({
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
            accountId: TEST_MODULE.accountId
        });
        expect(actual).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('create module (server error case)', async () => {
        parser.storeModule.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        var actual = await moduleAPI.createModule({
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
            accountId: TEST_MODULE.accountId
        });
        expect(actual).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('update module (pass case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.updateModule.mockResolvedValueOnce();
        expect(await moduleAPI.updateModule({
            id: TEST_MODULE.id, 
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
        })).toEqual(StatusCode.OK);
    });

    it('update module with coach (pass case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.updateModule.mockResolvedValueOnce();
        expect(await moduleAPI.updateModule({
            id: TEST_MODULE.id, 
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion
        })).toEqual(StatusCode.OK);
    });

    it('update module (duplicate case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.updateModule.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await moduleAPI.updateModule({
            id: TEST_MODULE.id, 
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
        })).toEqual(StatusCode.CONFLICT);
    });

    it('update module (bad data case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.updateModule.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await moduleAPI.updateModule({
            id: TEST_MODULE.id, 
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
        })).toEqual(StatusCode.BAD_REQUEST);
    });

    it('update module (connection lost case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.updateModule.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await moduleAPI.updateModule({
            id: TEST_MODULE.id, 
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
        })).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('update module (fatal error case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.updateModule.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await moduleAPI.updateModule({
            id: TEST_MODULE.id, 
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
        })).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('delete module (pass case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.deleteModule.mockResolvedValueOnce();
        expect(await moduleAPI.deleteModule(TEST_MODULE.id)).toEqual(StatusCode.OK);
    });

    it('delete module (duplicate case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.deleteModule.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await moduleAPI.deleteModule(TEST_MODULE.id)).toEqual(StatusCode.CONFLICT);
    });

    it('delete module (bad data case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.deleteModule.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await moduleAPI.deleteModule(TEST_MODULE.id)).toEqual(StatusCode.BAD_REQUEST);
    });

    it('delete module (connection lost case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.deleteModule.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await moduleAPI.deleteModule(TEST_MODULE.id)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('delete module (fatal error case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.deleteModule.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await moduleAPI.deleteModule(TEST_MODULE.id)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('get module variable (completion percent case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.getModuleVariable.mockResolvedValueOnce([{ completion_percent: 25 }]);
        expect(await moduleAPI.getModuleVariable(TEST_MODULE.id, "completion_percent")).toEqual([{ completion_percent: 25 }]);
    });
});

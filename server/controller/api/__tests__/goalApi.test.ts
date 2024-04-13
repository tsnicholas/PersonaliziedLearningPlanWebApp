export {};

import GoalAPI from "../goalApi";
import GoalParser from "../../../parser/goalParser";
import { STATUS_CODE } from "../../../types";
import { FAKE_ERRORS, TEST_GOAL, TEST_SUB_GOAL } from "../../global/mockValues";
import { GOAL_TYPE } from "../../../types";
jest.mock("../../../parser/goalParser");


describe('Goal Api Unit Tests', () => {
    let goalAPI : GoalAPI;
    let parser : any;

    beforeEach(() => {
        parser = new GoalParser();
        goalAPI = new GoalAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('get goals (normal case)', async () => {
        if(!TEST_GOAL.moduleId) throw new Error("Module id is undefined!");
        parser.parseParentGoals.mockResolvedValueOnce([
            {
                goal_id: TEST_GOAL.id[0], name: TEST_GOAL.name[0], description: TEST_GOAL.description[0], goal_type: TEST_GOAL.goalType, 
                completion: TEST_GOAL.isComplete, module_id: TEST_GOAL.moduleId, parent_goal: null
            },
            {
                goal_id: TEST_GOAL.id[1], name: TEST_GOAL.name[1], description: TEST_GOAL.description[1], goal_type: TEST_GOAL.goalType,
                completion: TEST_GOAL.isComplete, module_id: TEST_GOAL.moduleId, parent_goal: null
            },
            {
                goal_id: TEST_GOAL.id[2], name: TEST_GOAL.name[2], description: TEST_GOAL.description[2], goal_type: TEST_GOAL.goalType,
                completion: TEST_GOAL.isComplete, module_id: TEST_GOAL.moduleId, parent_goal: null
            }
        ]);
        parser.parseSubGoals.mockImplementation((goalId : number) => {
            switch(goalId) {
                case TEST_GOAL.id[0]:
                    return Promise.resolve([
                        {
                            goal_id: TEST_SUB_GOAL.id[0], name: TEST_SUB_GOAL.name[0], description: TEST_SUB_GOAL.description[0], 
                            goal_type: TEST_GOAL.goalType, completion: false, module_id: TEST_GOAL.moduleId, 
                            parent_goal: TEST_GOAL.id
                        },
                        {
                            goal_id: TEST_SUB_GOAL.id[1], name: TEST_SUB_GOAL.name[1], description: TEST_SUB_GOAL.description[1], 
                            goal_type: TEST_GOAL.goalType,completion: false, module_id: TEST_GOAL.moduleId,  
                            parent_goal: TEST_GOAL.id
                        }
                    ]);
                case TEST_GOAL.id[1]:
                    return Promise.resolve([
                        {
                            goal_id: TEST_SUB_GOAL.id[2], name: TEST_SUB_GOAL.name[2], description: TEST_SUB_GOAL.description[2], 
                            goal_type: TEST_GOAL.goalType, completion: false, module_id: TEST_GOAL.moduleId, parent_goal: 6
                        }
                    ]);
                case TEST_GOAL.id[2]:
                    return Promise.resolve([]);
                default:
                    console.error("Something went wrong while executing get goals test.");
                    return Promise.reject(FAKE_ERRORS.fatalServerError);
            }
        });
        expect(await goalAPI.getGoals(TEST_GOAL.moduleId)).toEqual([
            {
                goal_id: TEST_GOAL.id[0], 
                name: TEST_GOAL.name[0], 
                description: TEST_GOAL.description[0], 
                goal_type: TEST_GOAL.goalType,
                completion: TEST_GOAL.isComplete,
                module_id: TEST_GOAL.moduleId,
                parent_goal: null, 
                sub_goals: [
                    {
                        goal_id: TEST_SUB_GOAL.id[0],
                        name: TEST_SUB_GOAL.name[0],
                        description: TEST_SUB_GOAL.description[0],
                        completion: false,
                        goal_type: TEST_GOAL.goalType,
                        module_id: TEST_GOAL.moduleId,
                        parent_goal: TEST_GOAL.id
                    },
                    {
                        goal_id: TEST_SUB_GOAL.id[1],
                        name: TEST_SUB_GOAL.name[1],
                        description: TEST_SUB_GOAL.description[1],
                        completion: false,
                        goal_type: TEST_GOAL.goalType,
                        module_id: TEST_GOAL.moduleId,
                        parent_goal: TEST_GOAL.id
                    }
                ]
            },
            {
                goal_id: TEST_GOAL.id[1],
                name: TEST_GOAL.name[1],
                description: TEST_GOAL.description[1],
                completion: false,
                goal_type: TEST_GOAL.goalType,
                module_id: TEST_GOAL.moduleId,
                parent_goal: null,
                sub_goals: [
                    {
                        goal_id: TEST_SUB_GOAL.id[2],
                        name: TEST_SUB_GOAL.name[2],
                        description: TEST_SUB_GOAL.description[2],
                        completion: false,
                        goal_type: TEST_GOAL.goalType,
                        module_id: TEST_GOAL.moduleId,
                        parent_goal: 6
                    }
                ]
            },
            {
                goal_id: TEST_GOAL.id[2],
                name: TEST_GOAL.name[2],
                description: TEST_GOAL.description[2],
                completion: false,
                goal_type: TEST_GOAL.goalType,
                module_id: TEST_GOAL.moduleId,
                parent_goal: null,
                sub_goals: []
            }
        ]);
    });

    it('get goals (network error case)', async () => {
        if(!TEST_GOAL.moduleId) throw new Error("Module id is undefined!");
        parser.parseParentGoals.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.getGoals(TEST_GOAL.moduleId)).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it('get goals (fatal server error case)', async () => {
        if(!TEST_GOAL.moduleId) throw new Error("Module id is undefined!");
        parser.parseParentGoals.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.getGoals(TEST_GOAL.moduleId)).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('create goal (correct case without due date)', async () => {
        parser.storeGoal.mockResolvedValueOnce({});
        const actual = await goalAPI.createGoal({
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goal_type: TEST_GOAL.goalType, 
            is_complete: TEST_GOAL.isComplete, 
            module_id: TEST_GOAL.moduleId}
        );
        expect(actual).toEqual(STATUS_CODE.OK);
    });

    it('create goal (correct case with due date)', async () => {
        const testObject = {
            name: TEST_GOAL.name[0],
            description: TEST_GOAL.description[0],
            goal_type: TEST_GOAL.goalType,
            is_complete: TEST_GOAL.isComplete,
            module_id: TEST_GOAL.moduleId,
            due_date: TEST_GOAL.dueDate
        }
        parser.storeGoal.mockResolvedValueOnce({});
        const actual = await goalAPI.createGoal(testObject);
        expect(parser.storeGoal).toHaveBeenCalledTimes(1);
        expect(parser.storeGoal).toHaveBeenCalledWith({
            ...testObject,
            due_date: "2025-01-01 23:59:59.000 "
        });
        expect(actual).toEqual(STATUS_CODE.OK);
    });

    it('create goal (primary key violation case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        var actual = await goalAPI.createGoal({
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goal_type: TEST_GOAL.goalType, 
            is_complete: TEST_GOAL.isComplete, 
            module_id: TEST_GOAL.moduleId
        });
        expect(actual).toEqual(STATUS_CODE.CONFLICT);
    });

    it('create goal (network error case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        var actual = await goalAPI.createGoal({
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goal_type: TEST_GOAL.goalType, 
            is_complete: TEST_GOAL.isComplete, 
            module_id: TEST_GOAL.moduleId
        });
        expect(actual).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it('create goal (server error case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        var actual = await goalAPI.createGoal({
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            is_complete: TEST_GOAL.isComplete, 
            module_id: TEST_GOAL.moduleId,
            goal_type: GOAL_TYPE.DAILY
        });
        expect(actual).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('update goal (pass case)', async () => {
        parser.updateGoal.mockResolvedValueOnce();
        expect(await goalAPI.updateGoal({
            goal_id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goal_type: TEST_GOAL.goalType, 
            is_complete: TEST_GOAL.isComplete
        })).toEqual(STATUS_CODE.OK);
    });

    it('update goal (duplicate case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await goalAPI.updateGoal({
            goal_id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goal_type: TEST_GOAL.goalType, 
            is_complete: TEST_GOAL.isComplete
        })).toEqual(STATUS_CODE.CONFLICT);
    });

    it('update goal (bad data case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await goalAPI.updateGoal({
            goal_id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goal_type: TEST_GOAL.goalType, 
            is_complete: TEST_GOAL.isComplete
        })).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it('update goal (connection lost case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.updateGoal({
            goal_id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goal_type: TEST_GOAL.goalType, 
            is_complete: TEST_GOAL.isComplete
        })).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it('update goal (fatal error case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.updateGoal({
            goal_id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goal_type: TEST_GOAL.goalType, 
            is_complete: TEST_GOAL.isComplete
        })).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('update goal feedback (correct case)', async () => {
        parser.updateGoalFeedback.mockResolvedValueOnce();
        const actual = await goalAPI.updateGoalFeedback(TEST_GOAL.id[0], "this is feedback");
        expect(parser.updateGoalFeedback).toHaveBeenCalledTimes(1);
        expect(parser.updateGoalFeedback).toHaveBeenCalledWith(TEST_GOAL.id[0], "this is feedback");
        expect(actual).toEqual(STATUS_CODE.OK);
    });

    it('delete goal (pass case)', async () => {
        parser.deleteGoal.mockResolvedValueOnce();
        expect(await goalAPI.deleteGoal(TEST_GOAL.id[0])).toEqual(STATUS_CODE.OK);
    });

    it('delete goal (duplicate case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await goalAPI.deleteGoal(TEST_GOAL.id[0])).toEqual(STATUS_CODE.CONFLICT);
    });

    it('delete goal (bad data case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await goalAPI.deleteGoal(TEST_GOAL.id[0])).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it('delete goal (connection lost case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.deleteGoal(TEST_GOAL.id[0])).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it('delete goal (fatal error case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.deleteGoal(TEST_GOAL.id[0])).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('parse goal attribute (name case)', async () => {
        parser.parseGoalVariable.mockResolvedValueOnce([{name: TEST_GOAL.name}]);
        expect(await goalAPI.getGoalVariable(TEST_GOAL.id[0], "name")).toEqual([{name: TEST_GOAL.name}]);
    });

    it('parse goal attribute (module id case)', async () => {
        parser.parseGoalVariable.mockResolvedValueOnce([{module_id: TEST_GOAL.moduleId}]);
        expect(await goalAPI.getGoalVariable(TEST_GOAL.id[0], "module_id")).toEqual([{module_id: TEST_GOAL.moduleId}]);
    });

    it('parse goal attribute (bad request)', async () => {
        parser.parseGoalVariable.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await goalAPI.getGoalVariable(TEST_GOAL.id[0], "name")).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it('parse goal attribute (network error case)', async () => {
        parser.parseGoalVariable.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.getGoalVariable(TEST_GOAL.id[0], "name")).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it('parse goal attribute (fatal server error case)', async () => {
        parser.parseGoalVariable.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.getGoalVariable(TEST_GOAL.id[0], "name")).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });
});

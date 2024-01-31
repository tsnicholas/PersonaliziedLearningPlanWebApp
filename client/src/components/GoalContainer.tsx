import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import GoalStepper from "./GoalItem";
import { ApiClient } from "../hooks/ApiClient";
import { Goal, GoalHeaderProps } from "../types";
import useGoals from "../hooks/useGoals";

const GoalHeader = ({ moduleID }: any) => {
  const [steps, setSteps] = useState<Goal[]>([]);
  const { data, isLoading, error } = useGoals(moduleID);
  console.log(steps.map((step: Goal) => step.name));
  const [goalProgress, setGoalProgress] = useState(0);
  const addGoalProgress = () => {
    if (goalProgress < 100) setGoalProgress(goalProgress + 100 / steps.length);
  };
  const restGoalProgress = () => {
    if (goalProgress > 0) setGoalProgress(goalProgress - 100 / steps.length);
  };
  const { get } = ApiClient();

  // useEffect(() => {
  //   async function getGoals() {
  //     try {
  //       const result = await get(`/goal/get/module/${moduleID}`);
  //       let newGoals : Goal[] = [];
  //       for (let goal of result) {
  //         newGoals.push({
  //           id: goal.goal_id,
  //           name: goal.name,
  //           description: goal.description,
  //           isComplete: goal.is_complete,
  //           moduleId: moduleID
  //         });
  //       }
  //       setSteps(newGoals);
  //     } catch (error : any) {
  //       console.error(error);
  //       alert(error.response ? error.response.data : error);
  //     }
  //   }

  //   getGoals();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const addGoal = (goal: Goal) => {
    if (steps.includes(goal)) {
      return;
    }
    let newGoals: Goal[] = ([] as Goal[]).concat(steps);
    newGoals.push(goal);
    setSteps(newGoals);
  };

  function editGoal(updatedGoal: Goal) {
    const newGoal = steps.map((goal) => {
      if (goal.id === updatedGoal.id) {
        return {
          ...goal,
          name: updatedGoal.name,
          description: updatedGoal.description,
        };
      }
      return goal;
    });
    setSteps(newGoal);
  }

  const deleteGoal = (id: number) => {
    const newGoals = steps.filter((goal) => goal.id !== id);
    setSteps(newGoals);
  };

  return (
    <div className="relative flex h-screen">
      <div className="flex w-full relative items-center bg-element-base text-text-color h-[300px] pl-[3%]">
        {/* make component for this */}
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress
            variant={"determinate"}
            value={100}
            size={200}
            style={{
              color: "white",
              outlineColor: "black",
              position: "absolute",
            }}
          />
          <CircularProgress
            variant={"determinate"}
            value={goalProgress}
            size={200}
            style={{ color: "#6FC3FF", outlineColor: "black" }}
          />
          <Typography
            position="absolute"
            sx={{ fontSize: "2rem", fontFamily: "var(--bodyFont)" }}
          >
            {Math.floor(goalProgress)}%
          </Typography>
        </Box>

        <div className="flex overflow-hidden bg-white flex-col absolute h-auto w-3/5 rounded min-h-[80vh] top-1/2 left-[20%] p-[3%] shadow-md">
          console.log(data);
          {data?.map((goal: Goal) => (
            <GoalStepper key={goal.id} goal={goal} />
          ))}
          <button className="flex flex-row transition-transform rounded  w-full h-[100px] border-2 border-dashed border-[#F4F4F4] justify-center items-center hover:scale-105">
            <h1 className="text-black font-headlineFont text-4xl">Add Goal</h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalHeader;

import React, { useEffect } from "react";
import ModuleComponent from "./ModuleComponent";
import { useAuth } from "../../../context/AuthContext";
import { emptyUser } from "../../../types";

function LearningPlan() {
  const { setUser } = useAuth();

  useEffect(() => {
    console.log(`Default screen: ${sessionStorage.getItem("user")}`);
    const currentUser: string | null = sessionStorage.getItem("user");
    setUser(currentUser ? JSON.parse(currentUser) : emptyUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-[2%] h-screen bg-[#F1F1F1]">
      <ModuleComponent />
    </div>
  );
}

export default LearningPlan;

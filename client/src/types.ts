type ObjectValues<T> = T[keyof T];

export const GOAL_TYPE = {
  ONCE: "todo",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly"
} as const;
export type GoalType = ObjectValues<typeof GOAL_TYPE>;

export const ROLES = {
  ADMIN: "admin",
  COACH: "coach",
  BASIC: "basic",
} as const;
export type Role = ObjectValues<typeof ROLES>;

export interface Module {
  id: number;
  name: string;
  description: string;
  completion: number;
}

export interface Goal {
  goal_id: number;
  name: string;
  description: string;
  goal_type: GoalType;
  is_complete: boolean;
  module_id: number;
  due_date?: string | null;
  sub_goals?: Goal[];
  tag_name?: string;
  color?: string;
  feedback?: string;
}

export interface User {
  id: number;
  role: Role;
  accessToken: string;
  refreshToken: string;
}

export type Profile = {
  [key: string]: number | string;
  id: number,
  username: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  bio: string;
};

export type Settings = {
  receiveEmails: boolean;
  allowCoachInvitations: boolean;
};

export type Tag = {
  id?: number;
  name: string;
  color: string;
  accountId: number;
};

export type Understudy = {
  account_id: number;
  profile_id: number;
  username: string;
  coach_id: number;
};

export type CreatedMessage = {
  content: string,
  sender_id: number,
  recipient_id: number
};

export type Message = CreatedMessage & {
  id: number,
  username: string,
  date: string
};

export type CreateProfileProps = {
  username: string;
  firstName: string;
  lastName: string;
  account_id: number;
}

export type CreateInvitationProps = {
  senderId: number;
  recipientId: number;
}

export type CreateModuleProps = {
  module_name: string;
  description: string;
  account_id: number;
}

export type CreateGoalProps = {
  name: string;
  description: string;
  goalType: GoalType;
  isComplete: boolean;
  moduleId: number;
  dueDate?: string | null;
  tagId?: number | null;
}

export type CreateSubGoalProps = CreateGoalProps & {
  parentId: number;
}

export interface UpdateFeedbackProps {
  goal_id: number;
  feedback: string;
}

export interface LoginProps {
  email: string,
  password: string
}

export interface RegisterProps {
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string
}

export const emptyUser: User = { id: -1, role: "basic", accessToken: "", refreshToken: "" };
export const defaultSettings = {
  receiveEmails: true,
  allowCoachInvitations: true,
};

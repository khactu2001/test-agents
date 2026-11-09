export const ROLE_IDS = ["user", "lead", "developer", "reviewer", "qa"] as const;
export type RoleId = (typeof ROLE_IDS)[number];

export const AGENT_ROLE_IDS = ["lead", "developer", "reviewer", "qa"] as const;
export type AgentRoleId = (typeof AGENT_ROLE_IDS)[number];

export type RoleInfo = {
  id: RoleId;
  label: string;
  initial: string;
  color: string;
};

export const ROLES: Record<RoleId, RoleInfo> = {
  user: { id: "user", label: "Bạn", initial: "B", color: "#475569" },
  lead: { id: "lead", label: "Lead", initial: "L", color: "#7c3aed" },
  developer: { id: "developer", label: "Developer", initial: "D", color: "#2563eb" },
  reviewer: { id: "reviewer", label: "Reviewer", initial: "R", color: "#d97706" },
  qa: { id: "qa", label: "QA", initial: "Q", color: "#059669" },
};

export function isRoleId(value: unknown): value is RoleId {
  return typeof value === "string" && (ROLE_IDS as readonly string[]).includes(value);
}

import { ROLES, type RoleId } from "../../lib/roles";

export function RoleAvatar({ role }: { role: RoleId }) {
  const info = ROLES[role];
  return (
    <span
      aria-hidden="true"
      data-role={role}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: info.color,
        color: "#fff",
        fontWeight: 600,
      }}
    >
      {info.initial}
    </span>
  );
}

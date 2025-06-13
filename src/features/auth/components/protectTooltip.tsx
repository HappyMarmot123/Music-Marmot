"use client";

import MyTooltip from "../../../shared/components/myTooltip";
import { useAuth } from "@/app/providers/authProvider";

export default function ProtectTooltip({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = useAuth();

  const showTooltip = !role.favoriteInteract;

  return (
    <MyTooltip
      tooltipText={showTooltip ? "로그인이 필요합니다!" : ""}
      showTooltip={showTooltip}
    >
      {children}
    </MyTooltip>
  );
}

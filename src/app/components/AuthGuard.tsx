import { useEffect } from "react";
import { useNavigate } from "react-router";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem("yc_admin_token");

  useEffect(() => {
    if (!isAuthed) {
      navigate("/login", { replace: true });
    }
  }, [isAuthed, navigate]);

  if (!isAuthed) return null;
  return <>{children}</>;
}

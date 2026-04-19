import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuth2Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token     = params.get("token");
    const userName  = params.get("userName");
    const firstName = params.get("firstName");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        userName,
        userFirstName: firstName
      }));
      navigate("/profile");
    } else {
      navigate("/signin");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-sm">Signing you in...</p>
    </div>
  );
}
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuth2Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token") || localStorage.getItem("token");
    const userName      = params.get("userName");
    const userFirstName = params.get("userFirstName");
    const userLastName  = params.get("userLastName");
    const email         = params.get("email");
    const contactNumber = params.get("contactNumber");
    const role          = params.get("role");
    const error         = params.get("error");

    console.log("Full URL:", window.location.href);
    console.log("Token:", token);

    //  Handle error cases
    if (error === "EMAIL_EXISTS") {
      navigate("/signup?error=EMAIL_EXISTS");
      return;
    }

    if (error === "NO_ACCOUNT") {
      navigate("/signin?error=NO_ACCOUNT");
      return;
    }

    if (token) {
  // Only save if coming from OAuth
  if (params.get("token")) {
    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify({
      userName,
      userFirstName,
      userLastName,
      email,
      contactNumber,
      roles: [role],
    }));
  }

  navigate("/profile");
} else {
  navigate("/sign-in");
}
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent
          rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm">Signing you in with Google...</p>
      </div>
    </div>
  );
}
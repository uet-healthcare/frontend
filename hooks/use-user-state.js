import { useState, useEffect } from "react";
import { auth } from "utils/auth";

export function useUserState(props) {
  const [userState, setUserState] = useState({
    isLoggedIn: false,
    data: null,
  });
  useEffect(() => {
    if (auth.currentUser()) {
      setUserState({ isLoggedIn: true, data: auth.currentUser() });
    }
  }, []);

  return userState;
}

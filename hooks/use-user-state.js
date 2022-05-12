import { useState, useEffect, useMemo } from "react";
import { auth } from "utils/auth";
import { mainAPI } from "utils/axios";

export function useUserState(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser();
    if (!currentUser || !currentUser.id) return;

    setData(currentUser);

    const fetchData = () =>
      mainAPI
        .get(`/public/users/metadata?user_id=${currentUser.id}`)
        .then((response) => {
          const responseData = response.data;
          if (response.status === 200 && responseData.success) {
            window.localStorage.setItem(
              "user_metadata",
              JSON.stringify(responseData.data)
            );
            setIsLoggedIn(true);
            setMetadata(responseData.data);
          }
        });

    const localUserMetadata = window.localStorage.getItem("user_metadata");
    if (localUserMetadata) {
      try {
        setIsLoggedIn(true);
        setMetadata(JSON.parse(localUserMetadata));
      } catch (error) {
        window.localStorage.removeItem("user_metadata");
        fetchData();
      }
    } else {
      fetchData();
    }
  }, []);

  return useMemo(
    () => ({
      isLoggedIn,
      data,
      metadata,
    }),
    [isLoggedIn, data, metadata]
  );
}

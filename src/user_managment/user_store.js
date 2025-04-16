import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      loggedIn: false,
      id: null,
      user_type: null, // ✅ consistent naming
      setUserState: (id, user_type) =>
        set({
          loggedIn: true,
          id,
          user_type,
        }),
      clearState: () => {
        set({
          loggedIn: false,
          id: null,
          user_type: null,
        });
        localStorage.removeItem("user-store");
      },
    }),
    {
      name: "user-store",
      getStorage: () => localStorage,
    }
  )
);

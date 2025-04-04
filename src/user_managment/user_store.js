import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
	persist(
		(set) => ({
			loggedIn: false,
			id: 0,
            role: "",
			setUserState: (id, role) =>
				set({
					loggedIn: true,
					id: id,
                    user_type: role
				}),
			clearState: () => {
				set({
					loggedIn: false,
					id: 0,
                    user_type: ""
				});
				localStorage.removeItem("user-store");
			},
		}),
		{
			name: "user-store", // unique name for the storage key
			getStorage: () => localStorage, // specify the storage type
		}
	)
);
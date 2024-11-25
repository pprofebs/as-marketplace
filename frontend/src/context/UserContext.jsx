import React, { createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // For generating UUIDs

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("ASAccessToken"));
    const [guestUuid, setGuestUuid] = useState(localStorage.getItem("guest_uuid"));

    useEffect(() => {
        const initializeUser = async () => {
            if (token) {
                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                };

                const response = await fetch("http://127.0.0.1:8000/users/me", requestOptions);

                if (!response.ok) {
                    setToken(null);
                    localStorage.removeItem("ASAccessToken");
                } else {
                    localStorage.setItem("ASAccessToken", token);
                }
            } else {
                // Handle guest user logic
                if (!guestUuid) {
                    const newGuestUuid = uuidv4();
                    localStorage.setItem("guest_uuid", newGuestUuid);
                    setGuestUuid(newGuestUuid);
                }
            }
        };
        initializeUser();
    }, [token, guestUuid]);

    return (
        <UserContext.Provider value={{ token, setToken, guestUuid }}>
            {props.children}
        </UserContext.Provider>
    );
};
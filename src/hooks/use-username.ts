import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

const ADJECTIVES = ["Swift", "Silent", "Clever", "Brave", "Mighty", "Fierce"];
const ANIMALS = ["Lion", "Eagle", "Shark", "Wolf", "Tiger", "Falcon"];
const generateUsername = () => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adjective}-${animal}-${nanoid(5)}`;
};
const STORAGE_KEY = "realtime-private-chat-username";

export const useUsername = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const main = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUsername(stored);
        return;
      } else {
        const newUsername = generateUsername();
        localStorage.setItem(STORAGE_KEY, newUsername);
        setUsername(newUsername);
      }
    };

    main();
  });

  return { username };
};

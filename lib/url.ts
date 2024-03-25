import { getCookie } from "cookies-next";

let url: string =
  process?.env?.NODE_ENV === "production"
    ? "https://echo-chamber-gold.vercel.app"
    : "http://localhost:3000";

export const userID = getCookie("user");

export default url;

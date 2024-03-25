import { getCookie } from "cookies-next";

let url: string =
  process?.env?.NODE_ENV === "production"
    ? "https://sunflower-gold.vercel.app"
    : "http://localhost:3000";

export const userID = getCookie("user");

export default url;

import { createClient } from "@scute/core";

export const scuteClient = createClient({
  appId: process.env.REACT_APP_SCUTE_APP_ID,
  baseUrl: process.env.REACT_APP_SCUTE_BASE_URL,
});

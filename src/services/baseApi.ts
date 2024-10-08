import Axois from "axios";
import { DOMAIN, TOKEN } from "../utils/config";
import axios from "axios";

// type GET = { url: string; method: string; headers: GETHEADER };
// type GETHEADER = { tokenCybersoft: string };

//get base api
export class baseApi {
  get(url: string) {
    return Axois({
      url: `${DOMAIN}${url}`,
      method: "GET",
      headers: { tokenCybersoft: TOKEN },
    });
  }
  post() {}
}

export const customFetch = axios.create({
  baseURL: DOMAIN,
  headers: { tokenCybersoft: TOKEN },
});

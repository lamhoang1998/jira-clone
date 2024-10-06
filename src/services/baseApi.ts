import Axois from "axios";
import { DOMAIN, TOKEN } from "../utils/config";

// type GET = { url: string; method: string; headers: GETHEADER };
// type GETHEADER = { tokenCybersoft: string };

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

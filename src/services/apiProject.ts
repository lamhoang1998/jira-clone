import { baseApi } from "./baseApi";

export class apiProject extends baseApi {
  constructor() {
    super();
  }

  getProject() {
    return this.get(`/api/Project/getAllProject`);
  }
}

export const getProjectApi = new apiProject();

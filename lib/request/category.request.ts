import { axiosPublic } from "@/lib/axios";

export class CategoryRequest {
  static async GETS() {
    try {
      const response = await axiosPublic.get("/categories");
      return response.data.result;
    } catch (e) {
      console.error(e);
    }
  }
}

import { axiosPublic } from "@/lib/axios";
import { TableProps } from "@/lib/types";

export class CategoryRequest {
  static async GETS(page?: number, pageSize?: number, title?: string) {
    try {
      let response = null;
      if (page || pageSize || title) {
        const params = new URLSearchParams({
          page: page?.toString() || "1",
          size: pageSize?.toString() || "10",
        });
        if (title) {
          params.set("title", title);
        }
        response = await axiosPublic.get(`/categories?${params.toString()}`);
      } else {
        response = await axiosPublic.get("/categories");
      }
      return response.data.result;
    } catch (e) {
      console.error(e);
    }
  }
}

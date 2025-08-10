import { axiosInstance, axiosPublic } from "@/lib/axios";

export class CategoryRequest {
  static async GET(id: string) {
    try {
      const response = await axiosPublic.get(`/categories/${id}`);
      return response.data.result;
    } catch (e: any) {
      console.error(e);
      if (e.status === 404) {
        return null;
      }
      throw e;
    }
  }
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

  static async POST(data: any) {
    try {
      const response = await axiosInstance.post("/categories", data);
      return response.data.result.id;
    } catch (e) {
      console.error(e);
    }
  }
  static async DELETE(id: string) {
    try {
      const response = await axiosInstance.delete(`/categories/${id}`);
      return response.data.result;
    } catch (e) {
      console.error(e);
    }
  }
  static async PATCH(id: string, data: any) {
    try {
      await axiosInstance.patch(`/categories/${id}`, data);
    } catch (e) {
      console.error(e);
    }
  }
}

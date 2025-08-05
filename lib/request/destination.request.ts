import { axiosInstance, axiosPublic } from "@/lib/axios";

export class DestinationRequest {
  static async GETS(page: number, pageSize: number, title?: string) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
      });

      if (title) {
        params.set("title", title);
      }

      const response = await axiosPublic.get(`/destinations?${params.toString()}`);
      return response.data.result;
    } catch (e) {
      console.error(e);
    }
  }

  static async POST(data: any) {
    try {
      await axiosInstance.post("/destinations", data);
    } catch (e) {
      console.error(e);
    }
  }

  static async DELETE(id: string) {
    try {
      const response = await axiosInstance.delete(`/destinations/${id}`);
      return response.data.result;
    } catch (e) {
      console.error(e);
    }
  }
}

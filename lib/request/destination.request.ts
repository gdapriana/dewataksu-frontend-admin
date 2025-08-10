import { axiosInstance, axiosPublic } from "@/lib/axios";
import { DestinationType } from "@/lib/types";

export class DestinationRequest {
  static async GET(slug: string) {
    try {
      const response = await axiosPublic.get(`/destinations/${slug}`);
      return response.data.result;
    } catch (e: any) {
      console.error(e);
      if (e.status === 404) {
        return null;
      }
      throw e;
    }
  }
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
      const response = await axiosInstance.post("/destinations", data);
      return response.data.result.id;
    } catch (e) {
      console.error(e);
    }
  }

  static async PATCH(id: string, data: any) {
    try {
      await axiosInstance.patch(`/destinations/${id}`, data);
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

export class DestinationGalleryRequest {
  static async POST(body: { url: string; publicId?: string }[], id: string) {
    try {
      await axiosInstance.post(`/destinations/${id}/gallery`, body);
    } catch (e) {
      console.error(e);
    }
  }
}

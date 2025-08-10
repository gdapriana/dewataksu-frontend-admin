import z from "zod";

export class DestinationFormValidation {
  static readonly POST = z.object({
    title: z.string().min(1).max(200),
    content: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    mapUrl: z.string().url().optional().nullable(),
    latitude: z.string().refine(
      (v) => {
        let n = Number(v);
        return !isNaN(n) && v?.length > 0;
      },
      { message: "invalid number" }
    ),
    longitude: z.string().refine(
      (v) => {
        let n = Number(v);
        return !isNaN(n) && v?.length > 0;
      },
      { message: "invalid number" }
    ),
    categoryId: z.string().cuid({ message: "invalid category id" }),
    price: z.string().refine(
      (v) => {
        let n = Number(v);
        return !isNaN(n) && v?.length > 0;
      },
      { message: "invalid number" }
    ),
    tags: z.array(z.string().min(1)).optional(),
    cover: z
      .object({
        url: z.string().url().nullable(),
        publicId: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
  });

  static readonly PATCH = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    mapUrl: z.string().url().optional().nullable(),
    latitude: z
      .string()
      .refine(
        (v) => {
          let n = Number(v);
          return !isNaN(n) && v?.length > 0;
        },
        { message: "invalid number" }
      )
      .optional(),
    longitude: z
      .string()
      .refine(
        (v) => {
          let n = Number(v);
          return !isNaN(n) && v?.length > 0;
        },
        { message: "invalid number" }
      )
      .optional(),
    categoryId: z.string().cuid({ message: "invalid category id" }).optional(),
    price: z
      .string()
      .refine(
        (v) => {
          let n = Number(v);
          return !isNaN(n) && v?.length > 0;
        },
        { message: "invalid number" }
      )
      .optional(),
    tags: z.array(z.string().min(1)).optional(),
    cover: z
      .object({
        url: z.string().url().nullable(),
        publicId: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
  });
}

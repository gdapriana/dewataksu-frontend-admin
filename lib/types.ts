export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum ActivityType {
  CREATE_STORY = "CREATE_STORY",
  UPDATE_STORY = "UPDATE_STORY",
  DELETE_STORY = "DELETE_STORY",
  LIKE_DESTINATION = "LIKE_DESTINATION",
  LIKE_TRADITION = "LIKE_TRADITION",
  LIKE_STORY = "LIKE_STORY",
  SAVE_DESTINATION = "SAVE_DESTINATION",
  SAVE_TRADITION = "SAVE_TRADITION",
  SAVE_STORY = "SAVE_STORY",
  CREATE_COMMENT = "CREATE_COMMENT",
  REPLY_COMMENT = "REPLY_COMMENT",
  UPDATE_PROFILE = "UPDATE_PROFILE",
  CREATE_CATEGORY = "CREATE_CATEGORY",
  UPDATE_CATEGORY = "UPDATE_CATEGORY",
  CREATE_TAG = "CREATE_TAG",
  UPDATE_TAG = "UPDATE_TAG",
}

export type ImageType = {
  id: string;
  url: string | null;
  publicId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryType = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TagType = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserType = {
  id: string;
  email: string;
  username: string;
  name: string | null;
  bio: string | null;
  role: Role;
  profileImageId: string | null;
  profileImage: ImageType | null;
  createdAt: Date;
  updatedAt: Date;
};

export type GalleryType = {
  id: string;
  imageId: string | null;
  traditionId: string | null;
  destinationId: string | null;
  image: ImageType | null;
  createdAt: Date;
  updatedAt: Date;
};

export type DestinationType = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  coverId: string | null;
  cover: ImageType | null;
  price: number | null;
  categoryId: string;
  mapUrl: string | null;
  category: CategoryType;
  tags: TagType[];
  galleries: GalleryType[];
  createdAt: Date;
  updatedAt: Date;
  _count: any;
};

export type TraditionType = {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  coverId: string | null;
  cover: ImageType | null;
  galleries: GalleryType[];
  createdAt: Date;
  updatedAt: Date;
};

export type StoryType = {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  isPublished: boolean;
  coverId: string | null;
  cover: ImageType | null;
  authorId: string;
  author: UserType;
  createdAt: Date;
  updatedAt: Date;
};

export type LikeType = {
  id: string;
  userId: string;
  user: UserType;
  destinationId: string | null;
  destination?: DestinationType | null;
  traditionId: string | null;
  tradition?: TraditionType | null;
  storyId: string | null;
  story?: StoryType | null;
  createdAt: Date;
};

export type BookmarkType = {
  id: string;
  userId: string;
  user: UserType;
  destinationId: string | null;
  destination?: DestinationType | null;
  traditionId: string | null;
  tradition?: TraditionType | null;
  storyId: string | null;
  story?: StoryType | null;
  createdAt: Date;
};

export type CommentType = {
  id: string;
  content: string;
  authorId: string;
  author: UserType;
  destinationId: string | null;
  destination?: DestinationType | null;
  traditionId: string | null;
  tradition?: TraditionType | null;
  storyId: string | null;
  story?: StoryType | null;
  parentId: string | null;
  parent?: CommentType | null;
  replies: CommentType[];
  createdAt: Date;
  updatedAt: Date;
};

export type ActivityLogType = {
  id: string;
  userId: string;
  user: UserType;
  action: ActivityType;
  details: any | null;
  targetId: string | null;
  createdAt: Date;
};

export type RegisterRequest = {
  username: string;
  password: string;
  name?: string;
  email?: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type UserPayload = {
  username: string;
  id: string;
  role: "USER" | "ADMIN";
};

export interface ErrorResponse {
  status: number;
  message: string;
}

export interface PaginationType {
  currentPage: number;
  nextCursor: string | null;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  searchQuery?: string;
}

export interface DestinationsTableProps {
  page: number;
  pageSize: number;
  title?: string;
}

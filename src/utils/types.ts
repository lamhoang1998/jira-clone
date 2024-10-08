export type AllProjects = {
  statusCode: number;
  message: string;
  content: Content[];
  dateTime: string;
};

export type Content = {
  members: Member[];
  creator: Creator;
  id: number;
  projectName: string;
  description: string;
  categoryId: number;
  categoryName: string;
  alias: string;
  deleted: boolean;
};

export type Member = {
  userId: number;
  name: string;
  avatar: string;
};

export type Creator = {
  id: number;
  name: string;
};

export type Contents = {
  contents: Content[];
};

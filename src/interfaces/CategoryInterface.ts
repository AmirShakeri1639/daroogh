export interface CategoryInterface {
  id: number;
  name: string;
  parentId?: number | null;
  type: number;
}

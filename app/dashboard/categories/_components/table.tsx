import { CategoryType, PaginationType, TableProps } from "@/lib/types";

export async function CategoriesTable({page, pageSize}: TableProps) {
    const categories: { data: CategoryType[], pagination: PaginationType }= await 
}
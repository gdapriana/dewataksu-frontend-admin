import { CategoryRequest } from "@/lib/request/category.request";
import { CategoryType, PaginationType, TableProps } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, EllipsisVertical, Palmtree } from "lucide-react";
import moment from "moment";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteAlert from "@/app/_components/delete-alert";
import { TablePagination } from "@/app/_components/table-pagination";

export async function CategoriesTable({ page, pageSize }: TableProps) {
  const data: { data: CategoryType[]; pagination: PaginationType } = await CategoryRequest.GETS(page, pageSize);
  const { data: categories, pagination } = data;
  return (
    <div className="flex flex-col justify-start items-stretch gap-4">
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Engagement</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-muted-foreground">"No categories found"</div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category: CategoryType) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      {category.description ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-sm text-muted-foreground line-clamp-1 whitespace-pre-wrap">{category.description}</div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[400px]">{category.description}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-muted-foreground">No description</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex justify-center items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Palmtree className="h-4 w-4" />
                            {category._count.destinations}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>{category._count.destinations} destinations</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{moment(category.createdAt).format("DD MMM YYYY")}</div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/categories/${category.id}`}>
                              Edit
                              <DropdownMenuShortcut>
                                <Edit />
                              </DropdownMenuShortcut>
                            </Link>
                          </DropdownMenuItem>
                          <DeleteAlert title={category.name} instance="categories" id={category.id} />
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <TablePagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} totalItems={pagination.totalItems} pageSize={pagination.pageSize} />
      </div>
    </div>
  );
}

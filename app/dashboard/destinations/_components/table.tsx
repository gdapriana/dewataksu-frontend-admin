import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TablePagination } from "@/app/_components/table-pagination";
import { Heart, Bookmark, EllipsisVertical, Text, Trash, Edit, ImageOff } from "lucide-react";
import { DestinationRequest } from "@/lib/request/destination.request";
import { DestinationsTableProps, DestinationType, PaginationType } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import DeleteAlert from "@/app/_components/delete-alert";
import Image from "next/image";
import Link from "next/link";

export async function DestinationsTable({ page, pageSize }: DestinationsTableProps) {
  const data: { data: DestinationType[]; pagination: PaginationType } = await DestinationRequest.GETS(page, pageSize);
  const { data: destinations, pagination } = data;

  return (
    <div className="flex flex-col justify-start items-stretch gap-4">
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Cover</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {destinations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-muted-foreground">"No destinations found"</div>
                </TableCell>
              </TableRow>
            ) : (
              destinations.map((destination: DestinationType) => (
                <TableRow key={destination.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{destination.title}</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-sm text-muted-foreground line-clamp-1 whitespace-pre-wrap">{destination.content}</div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[400px]">{destination.content}</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {destination.cover && destination.cover.url ? (
                          <Image width={1080} className="w-[40px] aspect-video object-cover" height={768} src={destination.cover.url} alt="cover" />
                        ) : (
                          <Button variant="ghost">
                            <ImageOff className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {destination.cover && destination.cover.url ? (
                          <Image width={1080} className="w-[400px] aspect-video object-cover" height={768} src={destination.cover.url} alt="cover" />
                        ) : (
                          "No Image Provided"
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{destination.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-start items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm whitespace-pre-wrap line-clamp-1">{destination.address}</span>
                        </TooltipTrigger>
                        <TooltipContent>{destination.address}</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {destination.tags.map((tag) => (
                        <Badge key={tag.slug} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{destination.price === 0 ? <Badge variant="secondary">Free</Badge> : <span className="font-medium">${destination.price?.toLocaleString()}</span>}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {destination._count.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="h-4 w-4" />
                        {destination._count.bookmarks}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(destination.createdAt).toLocaleDateString()}</div>
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
                            <Link href={`/dashboard/destinations/${destination.slug}`}>
                              Edit
                              <DropdownMenuShortcut>
                                <Edit />
                              </DropdownMenuShortcut>
                            </Link>
                          </DropdownMenuItem>
                          <DeleteAlert title={destination.title} instance="destinations" id={destination.id} />
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

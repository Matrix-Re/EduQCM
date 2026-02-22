"use client";

import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type Qcm, useQcmStore } from "~/store/qcm";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { APP_ROUTES } from "~/constants/appRoutes";
import { useTranslation } from "react-i18next";

export function TableQcm({
  onSelectionChange,
}: {
  onSelectionChange: (newSelectedIds: number[]) => void;
}) {
  const { t } = useTranslation();
  const { qcms, fetchQcms } = useQcmStore();

  const columns: ColumnDef<Qcm>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "label",
      header: t("quiz_management.label"),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("label")}</span>
      ),
    },

    {
      accessorKey: "topic",
      header: t("quiz_management.topic"),
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("topic")}</span>
      ),
    },

    {
      accessorKey: "author",
      header: t("quiz_management.author"),
      cell: ({ row }) => <span>{row.getValue("author")}</span>,
    },

    {
      accessorKey: "question_count",
      header: t("quiz_management.number_of_questions"),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("question_count")}</span>
      ),
    },

    {
      accessorKey: "assignment_count",
      header: t("quiz_management.assignment_number"),
      cell: ({ row }) => <span>{row.getValue("assignment_count")}</span>,
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const qcm = row.original;
        const { removeQcm } = useQcmStore();
        const navigate = useNavigate();

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigate(APP_ROUTES.APP.QUIZ_MANAGEMENT.VIEW(qcm.id))
                }
              >
                {t("quiz_management.view")}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  navigate(APP_ROUTES.APP.QUIZ_MANAGEMENT.EDIT(qcm.id))
                }
              >
                {t("quiz_management.edit")}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => removeQcm(qcm.id)}>
                {t("quiz_management.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: qcms,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    fetchQcms();
  }, []);

  useEffect(() => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id);

    onSelectionChange(selectedIds);
  }, [table.getFilteredSelectedRowModel().rows.length]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t("quiz_management.columns")} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("quiz_management.no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {t("quiz_management.selected_rows", {
            count: table.getFilteredSelectedRowModel().rows.length,
            total: table.getFilteredRowModel().rows.length,
          })}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("quiz_management.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("quiz_management.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}

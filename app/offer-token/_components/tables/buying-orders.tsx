"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "role", "status", "actions"];

const columns = [
  { name: "Price", uid: "price" },
  { name: "Amount", uid: "amount" },
  { name: "Total", uid: "total" },
  { name: "My Size", uid: "mySize" },
];

const data = [
  { price: 0.093765, amount: 17.711, total: 1.64710513, mySize: null, id: 5 },
  { price: 0.093765, amount: 17.711, total: 1.64710513, mySize: null, id: 4 },
  { price: 0.093765, amount: 17.711, total: 1.64710513, mySize: null, id: 4 },
  { price: 0.093765, amount: 17.711, total: 1.64710513, mySize: null, id: 4 },
  { price: 0.093765, amount: 17.711, total: 1.64710513, mySize: null, id: 4 },
  { price: 0.093765, amount: 17.711, total: 1.64710513, mySize: null, id: 4 },
  { price: 0.093765, amount: 17.711, total: 1.64710513, mySize: null, id: 4 },
  { price: 0.093765, amount: 17.711, total: 1.64710513, mySize: null, id: 4 },
  { price: 0.093765, amount: 17.711, total: 1.64710513, mySize: null, id: 4 },
  { price: 0.093765, amount: 17.711, total: 1.64710513, mySize: null, id: 3 },
];

export default function BuyingOrders() {
  const renderCell = React.useCallback((item: any, columnKey: string) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "price":
        const wholeNumber = cellValue.toFixed(3);
        const afterDigits = cellValue.toString().substring(wholeNumber.length);
        return (
          <p className="text-space-green">
            {wholeNumber}
            <span className="text-light-space-green">{afterDigits}</span>
          </p>
        );

      default:
        return cellValue ?? "-";
    }
  }, []);

  const classNames = React.useMemo(
    () => ({
      th: ["bg-transparent", "text-gray80"],
      td: [
        "text-gray100 font-semibold text-right",

        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <Table
      isCompact
      removeWrapper
      aria-label="Example table with custom cells, pagination and sorting"
      checkboxesProps={{
        classNames: {
          wrapper: "after:bg-foreground after:text-background text-background",
        },
      }}
      classNames={classNames}
      topContentPlacement="outside"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={data}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

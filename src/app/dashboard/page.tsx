import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { User } from "../../lib/definitions";
import DashboardHeader from "../../components/dashboard/dashboardHeader";

async function getData(): Promise<User[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      created_at: new Date().toDateString(),
      updated_at: new Date(),
      name: "Maab Chaoui",
      status: "Active",
      email: "m@example.com",
      role: "user",
      photo: "",
    },
    {
      id: "489e1d42",
      created_at: new Date().toDateString(),
      updated_at: new Date(),
      name: "Sohaib Houhou",
      status: "Active",
      email: "m@example.com",
      role: "admin",
      photo: "",
    },
    {
      id: "0edawd76d",
      created_at: new Date().toDateString(),
      updated_at: new Date().toDateString(),
      email: "m@example.com",
      role: "admin",
      name: "Fran Garcia",
      status: "Deactivated",
      photo: "",
    },
    {
      id: "728ed52f",
      created_at: new Date().toDateString(),
      updated_at: new Date(),
      name: "Maab Chaoui",
      status: "Active",
      email: "m@example.com",
      role: "user",
      photo: "",
    },
    {
      id: "489e1d42",
      created_at: new Date().toDateString(),
      updated_at: new Date(),
      name: "Sohaib Houhou",
      status: "Active",
      email: "m@example.com",
      role: "admin",
      photo: "",
    },
    {
      id: "0edawd76d",
      created_at: new Date().toDateString(),
      updated_at: new Date(),
      email: "m@example.com",
      role: "admin",
      name: "Fran Garcia",
      status: "Deactivated",
      photo: "",
    },
    {
      id: "728ed52f",
      created_at: new Date().toDateString(),
      updated_at: new Date(),
      name: "Maab Chaoui",
      status: "Active",
      email: "m@example.com",
      role: "user",
      photo: "",
    },
    {
      id: "489e1d42",
      created_at: new Date().toDateString(),
      updated_at: new Date(),
      name: "Sohaib Houhou",
      status: "Active",
      email: "m@example.com",
      role: "admin",
      photo: "",
    },
    {
      id: "0edawd76d",
      created_at: new Date().toDateString(),
      updated_at: new Date(),
      email: "m@example.com",
      role: "admin",
      name: "Fran Garcia",
      status: "Deactivated",
      photo: "",
    },
    {
      id: "728ed52f",
      created_at: new Date().toDateString(),
      updated_at: new Date(),
      name: "Maab Chaoui",
      status: "Active",
      email: "m@example.com",
      role: "user",
      photo: "",
    },
    {
      id: "489e1d42",
      created_at: new Date().toDateString(),
      updated_at: new Date(),
      name: "Sohaib Houhou",
      status: "Active",
      email: "m@example.com",
      role: "admin",
      photo: "",
    },
    {
      id: "0edawd76d",
      created_at: new Date().toDateString(),
      updated_at: new Date(),
      email: "m@example.com",
      role: "admin",
      name: "Fran Garcia",
      status: "Deactivated",
      photo: "",
    },
    // ...
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DashboardHeader />
      <DataTable columns={columns} data={data} />
    </div>
  );
}

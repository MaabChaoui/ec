"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { increment } from "../../../store/features/counterSlice";

const documents = [
  { id: "1", title: "Document 1", description: "Description for Document 1" },
  { id: "2", title: "Document 2", description: "Description for Document 2" },
  { id: "3", title: "Document 3", description: "Description for Document 3" },
];

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <h2 className="text-xl mb-4">Documents</h2>
      <ul>
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex gap-2 justify-around items-center mb-4 p-4 border rounded"
          >
            <h3 className="text-2xl">{doc.title}</h3>
            <p>{doc.description}</p>
            <Link
              href={`/dashboard/docs/${doc.id}`}
              className="text-blue-500 underline"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/"> back to home</Link>
    </div>
  );
}

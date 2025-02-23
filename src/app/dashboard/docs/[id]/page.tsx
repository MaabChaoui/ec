// app/dashboard/document/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Hardcoded list with detailed document info (should be shared with Dashboard via Redux)
const hardcodedDocuments = [
  {
    id: "1",
    title: "Document 1",
    description: "Description for Document 1",
    metadata: {
      author: "Maab Chaoui",
      created: "2025-01-30",
      status: "On Hold",
    },
  },
  {
    id: "2",
    title: "Document 2",
    description: "Description for Document 2",
    metadata: {
      author: "Sohaib Houhou",
      created: "2025-02-19",
      status: "Done",
    },
  },
  {
    id: "3",
    title: "Sales Report",
    description: "Annual sales report for the eastern division",
    metadata: {
      author: "Abbassi ishak",
      created: "2024-12-11",
      status: "Done",
    },
  },
];

export default function DocumentDetail() {
  const router = useRouter();
  const { id } = useParams();

  const doc = hardcodedDocuments.find((d) => d.id === id);

  const [metadata, setMetadata] = useState(doc?.metadata || {});
  const [isEditing, setIsEditing] = useState(false); // when clicking Edit Metadata

  if (!doc) {
    return <div>Document not found</div>;
  }

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 underline"
      >
        Back
      </button>
      <h1 className="text-3xl font-bold mb-2">{doc.title}</h1>
      <p className="mb-6">{doc.description}</p>
      <h2 className="text-2xl font-semibold mb-2">Metadata</h2>
      <div className="border p-4 rounded">
        {isEditing ? (
          <div>
            <label className="block mb-2">
              Author:
              <input
                type="text"
                value={metadata.author || ""}
                onChange={(e) =>
                  setMetadata({ ...metadata, author: e.target.value })
                }
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              Created:
              <input
                type="date"
                value={metadata.created || ""}
                onChange={(e) =>
                  setMetadata({ ...metadata, created: e.target.value })
                }
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              Status:
              <input
                type="text"
                value={metadata.status || ""}
                onChange={(e) =>
                  setMetadata({ ...metadata, status: e.target.value })
                }
                className="border p-2 w-full"
              />
            </label>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white p-2 mt-4"
            >
              Save
            </button>
          </div>
        ) : (
          <div>
            <p>
              <strong>Author:</strong> {metadata.author}
            </p>
            <p>
              <strong>Created:</strong> {metadata.created}
            </p>
            <p>
              <strong>Status:</strong> {metadata.status}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white p-2 mt-4"
            >
              Edit Metadata
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

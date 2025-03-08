// app/lib/features/documents/documentsSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type Document = {
  id: string;
  name: string;
  type: "folder" | "file";
  parentFolder?: string | null;
  createdAt: string;
  updatedAt: string;
  size?: number;
  fileType?: string;
  items?: number; // Only for folders
};

export type DocumentsState = {
  documents: Document[];
  loading: boolean;
  error: string | null;
  currentFolder: string | null;
};

const initialState: DocumentsState = {
  documents: [],
  loading: false,
  error: null,
  currentFolder: null,
};
export const fetchDocuments = createAsyncThunk(
  "documents/fetchDocuments",
  async (folderId: string | null = null) => {
    // Simulated API call with folder structure
    const mockDocuments: Document[] = [
      {
        id: "1",
        name: "Project Documents",
        type: "folder",
        parentFolder: null,
        createdAt: "2024-03-01",
        updatedAt: "2024-03-05",
        items: 3,
      },
      {
        id: "2",
        name: "Financial Reports",
        type: "folder",
        parentFolder: null,
        createdAt: "2024-02-15",
        updatedAt: "2024-03-10",
        items: 2,
      },
      {
        id: "3",
        name: "Project Plan.pdf",
        type: "file",
        parentFolder: "1",
        createdAt: "2024-03-02",
        updatedAt: "2024-03-05",
        size: 2456789,
        fileType: "pdf",
      },
      // Add more mock documents...
    ];

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Filter documents based on current folder
    return mockDocuments.filter((doc) => doc.parentFolder === folderId);
  },
);

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    navigateToFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch documents";
      });
  },
});

export const { navigateToFolder } = documentsSlice.actions;
export default documentsSlice.reducer;

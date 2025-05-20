// store/features/documentsSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Document } from "../../lib/definitions";

interface DocumentsState {
  documents: Document[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  perPage: number;
  searchTerm: string;
}

const initialState: DocumentsState = {
  documents: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  perPage: 10,
  searchTerm: "",
};

export const fetchDocuments = createAsyncThunk<
  {
    documents: Document[];
    totalPages: number;
    currentPage: number;
    perPage: number;
  },
  { page: number; perPage: number; searchTerm: string },
  { rejectValue: string }
>(
  "documents/fetchDocuments",
  async ({ page, perPage, searchTerm }, thunkAPI) => {
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
      search: searchTerm,
    });
    console.log(`/api/documents?${params.toString()}`);

    const res = await fetch(`/api/documents?${params.toString()}`, {
      credentials: "include",
    });
    if (!res.ok) {
      const { message } = await res.json().catch(() => ({}));
      return thunkAPI.rejectWithValue(message ?? `Error ${res.status}`);
    }
    const data = await res.json();
    console.log("Got the data: ", data);
    return {
      documents: data.content as Document[],
      totalPages: data.totalPages as number,
      currentPage: (data.number as number) + 1,
      perPage: data.size as number,
    };
  },
);

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      console.log("setSearchTerm: (document) ", action.payload);
      state.searchTerm = action.payload;
      state.currentPage = 1;
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
        state.documents = action.payload.documents;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.perPage = action.payload.perPage;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch documents";
      });
  },
});

export const { setSearchTerm } = documentsSlice.actions;
export default documentsSlice.reducer;

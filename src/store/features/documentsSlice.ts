/* ----------------------------------------------------------------
   Documents Redux slice
   ---------------------------------------------------------------- */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Document } from "../../lib/definitions";

/* ---------- type ---------- */

/* ---------- state ---------- */
interface DocumentsState {
  documents: Document[];
  loading: boolean;
  error: string | null;
}

const initialState: DocumentsState = {
  documents: [],
  loading: false,
  error: null,
};

/* ----------------------------------------------------------------
      THUNK: fetchDocuments
      ----------------------------------------------------------------
      ‣ Calls your Next-proxy route `/api/documents`
      ‣ That proxy will read the session cookie, add the JWT header, and
        forward the request to SpringBoot `/api/document`
      ‣ For now no params; extend later with search / pagination
   ------------------------------------------------------------------ */
export const fetchDocuments = createAsyncThunk<
  Document[], // return type
  void, // arg type
  { rejectValue: string } // reject type
>("documents/fetchDocuments", async (_, thunkAPI) => {
  const res = await fetch("/api/documents", {
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return thunkAPI.rejectWithValue(data.message ?? `Error ${res.status}`);
  }

  const data = (await res.json()) as Document[];
  console.log("Next /api/document returned: ", data);
  return data;
});

/* ----------------------------------------------------------------
      SLICE
   ------------------------------------------------------------------ */
const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {}, // add filters/pagination later
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
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch documents";
      });
  },
});

export default documentsSlice.reducer;

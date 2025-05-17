import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category } from "../../lib/definitions";

/* ---------- state ---------- */
interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

/* ---------- thunk ---------- */
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("categories/fetchCategories", async (_, thunkAPI) => {
  const res = await fetch("/api/categories", { credentials: "include" });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return thunkAPI.rejectWithValue(data.message ?? `Error ${res.status}`);
  }
  return (await res.json()) as Category[];
});

/* ---------- slice ---------- */
const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCategories.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchCategories.fulfilled, (s, a) => {
        s.loading = false;
        s.categories = a.payload;
      })
      .addCase(fetchCategories.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? a.error.message ?? "Failed to fetch categories";
      });
  },
});

export default categoriesSlice.reducer;

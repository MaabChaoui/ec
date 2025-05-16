// app/lib/features/departments/departmentsSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Department } from "../../lib/definitions";

interface DepartmentsState {
  departments: Department[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentsState = {
  departments: [],
  loading: false,
  error: null,
};

export const fetchDepartments = createAsyncThunk<
  Department[],
  void,
  { rejectValue: string }
>("departments/fetchDepartments", async (_, thunkAPI) => {
  console.log("fetching departments...");
  const res = await fetch("/api/departments", {
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return thunkAPI.rejectWithValue(data.message || `Error ${res.status}`);
  }

  const data: Department[] = await res.json();
  return data;
});

const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to load";
      });
  },
});

export default departmentsSlice.reducer;

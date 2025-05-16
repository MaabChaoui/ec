// app/lib/features/users/usersSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../lib/definitions";
import { Search } from "lucide-react";
// import { cookies } from "next/headers";

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  perPage: number;
  searchTerm: string;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  perPage: 5,
  searchTerm: "",
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({
    page,
    perPage,
    searchTerm,
  }: {
    page: number;
    perPage: number;
    searchTerm: string;
  }) => {
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
      search: searchTerm,
    });

    console.log(`/api/users?${params.toString()}`);
    // const res = await fetch(`/api/users`, {
    const res = await fetch(`/api/users?${params.toString()}`, {
      // sends the cookie, nothing else to add
      credentials: "include",
    });

    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(message ?? `Error ${res.status}`);
    }

    const data = await res.json(); // ← whatever shape Spring gives bac
    console.log("dataaaaa:", data);
    return {
      users: data.content ?? data.users,
      totalPages: data.totalPages,
      currentPage: data.number + 1 || page,
      perPage: data.size || perPage,
    };
    return {
      users: data,
      totalPages: 1,
      currentPage: 1,
      perPage: 20,
    };
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when search changes
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.perPage = action.payload.perPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export const { setSearchTerm } = usersSlice.actions;
export default usersSlice.reducer;

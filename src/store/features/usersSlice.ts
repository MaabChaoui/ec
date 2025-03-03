// app/lib/features/users/usersSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../lib/definitions";

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  // Simulated API call - replace with actual fetch to your backend
  const mockUsers: User[] = [
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
  return mockUsers;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export default usersSlice.reducer;

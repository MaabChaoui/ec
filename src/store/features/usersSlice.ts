// app/lib/features/users/usersSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../lib/definitions";
import { Search } from "lucide-react";

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
    // Simulated API call with pagination
    // const mockUsers = [
    const mockUsers: User[] = [
      {
        id: "728ed52f",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Maab Chaoui",
        status: "Active",
        email: "m@example.com",
        role: "user",
        photo: "",
      },
      {
        id: "489e1d42",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Sohaib Houhou",
        status: "Active",
        email: "m@example.com",
        role: "admin",
        photo: "",
      },
      {
        id: "0edawd76d",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email: "m@example.com",
        role: "admin",
        name: "Fran Garcia",
        status: "Deactivated",
        photo: "",
      },
      {
        id: "728ed52f",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Maab Chaoui",
        status: "Active",
        email: "m@example.com",
        role: "user",
        photo: "",
      },
      {
        id: "489e1d42",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Sohaib Houhou",
        status: "Active",
        email: "m@example.com",
        role: "admin",
        photo: "",
      },
      {
        id: "0edawd76d",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email: "m@example.com",
        role: "admin",
        name: "Fran Garcia",
        status: "Deactivated",
        photo: "",
      },
      {
        id: "728ed52f",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Maab Chaoui",
        status: "Active",
        email: "m@example.com",
        role: "user",
        photo: "",
      },
      {
        id: "489e1d42",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Sohaib Houhou",
        status: "Active",
        email: "m@example.com",
        role: "admin",
        photo: "",
      },
      {
        id: "0edawd76d",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email: "m@example.com",
        role: "admin",
        name: "Fran Garcia",
        status: "Deactivated",
        photo: "",
      },
      {
        id: "728ed52f",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Maab Chaoui",
        status: "Active",
        email: "m@example.com",
        role: "user",
        photo: "",
      },
      {
        id: "489e1d42",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Sohaib Houhou",
        status: "Active",
        email: "m@example.com",
        role: "admin",
        photo: "",
      },
      {
        id: "0edawd76d",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email: "m@example.com",
        role: "admin",
        name: "Fran Garcia",
        status: "Deactivated",
        photo: "",
      },
      {
        id: "728ed52f",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Maab Chaoui",
        status: "Active",
        email: "m@example.com",
        role: "user",
        photo: "",
      },
      {
        id: "489e1d42",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Sohaib Houhou",
        status: "Active",
        email: "m@example.com",
        role: "admin",
        photo: "",
      },
      {
        id: "0edawd76d",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email: "m@example.com",
        role: "admin",
        name: "Fran Garcia",
        status: "Deactivated",
        photo: "",
      },
      {
        id: "728ed52f",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Maab Chaoui",
        status: "Active",
        email: "m@example.com",
        role: "user",
        photo: "",
      },
      {
        id: "489e1d42",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Sohaib Houhou",
        status: "Active",
        email: "m@example.com",
        role: "admin",
        photo: "",
      },
      {
        id: "0edawd76d",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email: "m@example.com",
        role: "admin",
        name: "Fran Garcia",
        status: "Deactivated",
        photo: "",
      },
      {
        id: "728ed52f",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Maab Chaoui",
        status: "Active",
        email: "m@example.com",
        role: "user",
        photo: "",
      },
      {
        id: "489e1d42",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Sohaib Houhou",
        status: "Active",
        email: "m@example.com",
        role: "admin",
        photo: "",
      },
      {
        id: "728ed52f",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Maab Chaoui",
        status: "Active",
        email: "m@example.com",
        role: "user",
        photo: "",
      },
      {
        id: "489e1d42",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Sohaib Houhou",
        status: "Active",
        email: "m@example.com",
        role: "admin",
        photo: "",
      },
      {
        id: "0edawd76d",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email: "m@example.com",
        role: "admin",
        name: "Fran Garcia",
        status: "Deactivated",
        photo: "",
      },
      {
        id: "728ed52f",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Maab Chaoui",
        status: "Active",
        email: "m@example.com",
        role: "user",
        photo: "",
      },
      {
        id: "489e1d42",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Sohaib Houhou",
        status: "Active",
        email: "m@example.com",
        role: "admin",
        photo: "",
      },
      {
        id: "0edawd76d",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email: "m@example.com",
        role: "admin",
        name: "Fran Garcia",
        status: "Deactivated",
        photo: "",
      },
      {
        id: "728ed52f",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Maab Chaoui",
        status: "Active",
        email: "m@example.com",
        role: "user",
        photo: "",
      },
      {
        id: "489e1d42",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: "Sohaib Houhou",
        status: "Active",
        email: "m@example.com",
        role: "admin",
        photo: "",
      },
      // ...
    ];
    console.log("fetch users....", searchTerm);
    // Filter users based on search term (replace with actual API call)
    const filteredUsers = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Simulate paginated response
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedUsers = filteredUsers.slice(start, end);
    const totalPages = Math.ceil(filteredUsers.length / perPage);

    // Simulate API response delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      users: paginatedUsers,
      totalPages,
      currentPage: page,
      perPage,
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

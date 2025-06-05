'use client';

import { Navigation } from "@/components/Navigation";

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

export default function UsersManagementPage() {

  return (
    <Navigation>
      <h1 className="text-2xl font-bold">Users Management</h1>
    </Navigation>
  );
} 
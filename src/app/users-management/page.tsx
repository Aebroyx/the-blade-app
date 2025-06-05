'use client';

import { Navigation } from "@/components/Navigation";
import Table, { Column } from "@/components/ui/Table";
import { userService, GetUserResponse } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";

export default function UsersManagementPage() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
  });

  // Define table columns
  const columns: Column<GetUserResponse>[] = [
    {
      key: 'name',
      header: 'Name',
      className: 'font-medium text-gray-900 dark:text-gray-100',
    },
    {
      key: 'email',
      header: 'Email',
      className: 'text-gray-500 dark:text-gray-400',
    },
    {
      key: 'role',
      header: 'Role',
      className: 'text-gray-500 dark:text-gray-400',
      render: (user) => (
        <span className="capitalize">{user.role}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (user) => (
        <button
          onClick={() => console.log('Edit user:', user.id)}
          className="text-primary hover:text-primary-light"
        >
          Edit<span className="sr-only">, {user.name}</span>
        </button>
      ),
    },
  ];

  if (error) {
    return (
      <Navigation>
        <div className="text-red-500 p-4">
          Error: {error instanceof Error ? error.message : 'Failed to fetch users'}
        </div>
      </Navigation>
    );
  }

  return (
    <Navigation>
      <h1 className="text-2xl font-bold">Users Management</h1>
      <Table<GetUserResponse>
        title="Users List"
        description="A list of all the users including their name, email and role."
        columns={columns}
        data={users || []}
        keyExtractor={(user) => user.id}
        isLoading={isLoading}
        onAdd={() => console.log('Add new user')}
        addButtonText="Add User"
        emptyState={
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No users found</p>
            <button
              onClick={() => console.log('Add new user')}
              className="mt-2 text-sm text-primary hover:text-primary-light"
            >
              Add your first user
            </button>
          </div>
        }
      />
    </Navigation>
  );
} 
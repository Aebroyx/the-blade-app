'use client';

import { Navigation } from "@/components/Navigation";
import Table, { Column } from "@/components/ui/Table";
import { useDeleteUser, useGetAllUsers, useSoftDeleteUser } from "@/hooks/useUser";
import { GetUserResponse } from "@/services/userService";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteModal from '@/components/modals/DeleteModal';

export default function UsersManagementPage() {
  const router = useRouter();
  const { data: users, isLoading, error } = useGetAllUsers();
  // delete user
  const deleteUser = useDeleteUser();
  const softDeleteUser = useSoftDeleteUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const openDeleteModal = (id: number) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // await deleteUser.mutateAsync(id);
      await softDeleteUser.mutateAsync(id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    handleDelete(userToDelete);
  };

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
        <div className="flex justify-end gap-x-2">
          <button
            onClick={() => router.push(`/users-management/${user.id}`)}
            className="text-primary hover:text-primary-light inline-flex items-center gap-x-1"
          >
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => openDeleteModal(user.id)}
            className="text-red-500 hover:text-red-700 inline-flex items-center gap-x-1"
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
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
        onAdd={() => router.push('/users-management/add')}
        addButtonText="Add User"
        emptyState={
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No users found</p>
            <button
              onClick={() => router.push('/users-management/add')}
              className="mt-2 text-sm text-primary hover:text-primary-light"
            >
              Add your first user
            </button>
          </div>
        }
      />
      
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Navigation>
  );
} 
'use client';

import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userService";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const roleOptions = [
  { value: 'user', label: 'User' },
  { value: 'root', label: 'Root' },
  { value: 'admin', label: 'Admin' },
];

export default function AddUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      await userService.createUser(formData);
      router.push('/users-management');
    } catch (err) {
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message);
          if (typeof errorData === 'object' && errorData.errors) {
            setFieldErrors(errorData.errors);
            return;
          }
        } catch {
          // If error message is not JSON, treat it as a general error
        }
        setError(err.message);
      } else {
        setError('Failed to create user');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
    if (fieldErrors.role) {
      setFieldErrors(prev => ({
        ...prev,
        role: ''
      }));
    }
  };

  return (
    <Navigation>
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h1 className="text-base/7 font-semibold text-gray-900 dark:text-gray-100">Add User</h1>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md dark:bg-red-900/50 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <Input
                  label="Name"
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  error={fieldErrors.name}
                  autoComplete="name"
                />
              </div>

              <div className="sm:col-span-4">
                <Input
                  label="Email address"
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  error={fieldErrors.email}
                  autoComplete="email"
                />
              </div>

              <div className="sm:col-span-4">
                <Input
                  label="Username"
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  error={fieldErrors.username}
                  helperText="Username must be unique"
                />
              </div>

              <div className="sm:col-span-4">
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  error={fieldErrors.password}
                  helperText="Password must be at least 8 characters long"
                />
              </div>

              <div className="sm:col-span-3">
                <Select
                  label="Role"
                  name="role"
                  options={roleOptions}
                  value={formData.role}
                  onChange={handleRoleChange}
                  error={fieldErrors.role}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm/6 font-semibold text-gray-900 dark:text-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </Navigation>
  );
}

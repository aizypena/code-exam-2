interface Role {
  id: number
  role_name: string
  description: string | null
}

interface DeleteRoleProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  role: Role | null
}

export default function DeleteRole({
  isOpen,
  onClose,
  onConfirm,
  role,
}: DeleteRoleProps) {
  if (!isOpen || !role) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-red-600">Delete Role</h2>

        <p className="text-gray-700 mb-2">
          Are you sure you want to delete this role?
        </p>

        <div className="bg-gray-50 rounded-md p-4 mb-6">
          <p className="font-medium">{role.role_name}</p>
          <p className="text-sm text-gray-500">{role.description || 'No description'}</p>
        </div>

        <p className="text-sm text-red-500 mb-6">
          This action cannot be undone. Users assigned to this role may be affected.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 hover:cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

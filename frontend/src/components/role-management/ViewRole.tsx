interface Role {
  id: number
  role_name: string
  description: string | null
}

interface ViewRoleProps {
  isOpen: boolean
  onClose: () => void
  role: Role | null
}

export default function ViewRole({ isOpen, onClose, role }: ViewRoleProps) {
  if (!isOpen || !role) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Role Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">ID</label>
            <p className="text-gray-900">{role.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Role Name
            </label>
            <p className="text-gray-900">{role.role_name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Description
            </label>
            <p className="text-gray-900">{role.description || 'No description'}</p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 hover:cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
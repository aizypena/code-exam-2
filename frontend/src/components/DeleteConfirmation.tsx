interface DeleteConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  itemName: string
  itemDescription?: string
  warningMessage?: string
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemDescription,
  warningMessage = 'This action cannot be undone.',
}: DeleteConfirmationProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-red-600">{title}</h2>

        <p className="text-gray-700 mb-2">
          Are you sure you want to delete this item?
        </p>

        <div className="bg-gray-50 rounded-md p-4 mb-6">
          <p className="font-medium">{itemName}</p>
          {itemDescription && (
            <p className="text-sm text-gray-500">{itemDescription}</p>
          )}
        </div>

        <p className="text-sm text-red-500 mb-6">{warningMessage}</p>

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

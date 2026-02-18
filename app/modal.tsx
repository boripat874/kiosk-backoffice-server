'use client'

interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}
 
export default function Modal({ title, children, isOpen, onClose }: ModalProps) {
  return (
    // Only render the div below if 'isOpen' is true
    isOpen && (
      // Modal Overlay
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-100">
        {/* Modal Container */}
        <div className={`bg-white rounded-lg shadow-lg min-w-1/4`}>
          {/* Modal Header */}
          <h2 className="text-xl mb-4 bg-teal-600 text-white p-4 rounded-t-lg">
            {title}
            {/* Close Button */}
            <button className="float-right text-gray-300" onClick={onClose}>
              <i className="fa-solid fa-xmark hover:text-white"></i>
            </button>
          </h2>
          {/* Modal Content */}
          <div className="px-4 pb-3">{children}</div>
        </div>
      </div>
    )
  );
}
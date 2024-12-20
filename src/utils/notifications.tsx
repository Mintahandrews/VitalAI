import { toast as hotToast } from "react-hot-toast";

export const notify = {
  success: (message: string) => {
    hotToast.success(message);
  },

  error: (message: string) => {
    hotToast.error(message);
  },

  info: (message: string) => {
    hotToast(message, {
      icon: "ℹ️",
    });
  },

  warning: (message: string) => {
    hotToast(message, {
      icon: "⚠️",
      style: {
        background: "#fff7ed",
        color: "#9a3412",
      },
    });
  },

  achievement: (title: string, description: string) => {
    hotToast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">🏆 {title}</p>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => hotToast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-right",
      }
    );
  },

  reminder: (message: string, action?: () => void) => {
    hotToast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">⏰</div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-900">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            {action && (
              <button
                onClick={() => {
                  action();
                  hotToast.dismiss(t.id);
                }}
                className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
              >
                Take Action
              </button>
            )}
            <button
              onClick={() => hotToast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none"
            >
              Dismiss
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-right",
      }
    );
  },
};

// Export a simple toast utility for basic notifications
export const toast = notify;

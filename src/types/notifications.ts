export interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  icon?: string | JSX.Element;
  style?: React.CSSProperties;
}

export interface CustomToastProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  icon?: string | JSX.Element;
  action?: {
    label: string;
    onClick: () => void;
  };
}
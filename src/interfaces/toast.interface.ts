/**
 * Represents a set of functions for displaying toast messages with various configurations.
 * Each function corresponds to a different toast type.
 */
export interface Toast {
  /**
   * Display a success toast message.
   *
   * @param {string} message - The message content to display in the toast.
   * @param {ToastConfig} config - Configuration options for the toast.
   * @returns {ToastResponse} - An object containing the message and toast configuration.
   */
  success: (message: string, config: ToastConfig) => ToastResponse;

  /**
   * Display an error toast message.
   *
   * @param {string} message - The message content to display in the toast.
   * @param {ToastConfig} config - Configuration options for the toast.
   * @returns {ToastResponse} - An object containing the message and toast configuration.
   */
  error: (message: string, config: ToastConfig) => ToastResponse;

  /**
   * Display an inverted (styled) toast message.
   *
   * @param {string} message - The message content to display in the toast.
   * @param {ToastConfig} config - Configuration options for the toast.
   * @returns {ToastResponse} - An object containing the message and toast configuration.
   */
  inverted: (message: string, config: ToastConfig) => ToastResponse;

  /**
   * Display an information (info) toast message.
   *
   * @param {string} message - The message content to display in the toast.
   * @param {ToastConfig} config - Configuration options for the toast.
   * @returns {ToastResponse} - An object containing the message and toast configuration.
   */
  info: (message: string, config: ToastConfig) => ToastResponse;

  /**
   * Display a warning toast message.
   *
   * @param {string} message - The message content to display in the toast.
   * @param {ToastConfig} config - Configuration options for the toast.
   * @returns {ToastResponse} - An object containing the message and toast configuration.
   */
  warning: (message: string, config: ToastConfig) => ToastResponse;

  /**
   * Display a grayscale (styled) toast message.
   *
   * @param {string} message - The message content to display in the toast.
   * @param {ToastConfig} config - Configuration options for the toast.
   * @returns {ToastResponse} - An object containing the message and toast configuration.
   */
  grayscale: (message: string, config: ToastConfig) => ToastResponse;

  /**
   * Display a custom-styled toast message.
   *
   * @param {string} message - The message content to display in the toast.
   * @param {ToastConfig} config - Configuration options for the toast.
   * @returns {ToastResponse} - An object containing the message and toast configuration.
   */
  custom: (message: string, config: ToastConfig) => ToastResponse;

  /**
   * Display a default (unstyled) toast message.
   *
   * @param {string} message - The message content to display in the toast.
   * @param {ToastConfig} config - Configuration options for the toast.
   * @returns {ToastResponse} - An object containing the message and toast configuration.
   */
  default: (message: string, config: ToastConfig) => ToastResponse;

  /**
   * Display a toast message with custom styling or theme.
   *
   * @param {string} message - The message content to display in the toast.
   * @param {ToastConfig} config - Configuration options for the toast.
   * @returns {ToastResponse} - An object containing the message and toast configuration.
   */
  theme: (message: string, config: ToastConfig) => ToastResponse;

  /**
   * Display a toast message with custom configuration options.
   *
   * @param {string} message - The message content to display in the toast.
   * @param {ToastConfig} config - Configuration options for the toast.
   * @returns {ToastResponse} - An object containing the message and toast configuration.
   */
  show: (message: string, config: ToastConfig) => ToastResponse;
}

/**
 * Represents the response object from displaying a toast message.
 */
export interface ToastResponse {
  /**
   * The message content that was displayed in the toast.
   */
  message: string;

  /**
   * Configuration options used for displaying the toast.
   */
  config: ToastConfig;
}

/**
 * Represents the configuration options for displaying a toast message.
 */
export interface ToastConfig {
  /**
   * The position of the toast on the screen.
   */
  position?: string;

  /**
   * A custom CSS class name to apply to the toast element.
   */
  className?: string;

  /**
   * The duration (in milliseconds) for which the toast should remain visible.
   */
  fadeDuration?: number;

  /**
   * The interval (in milliseconds) for fading in/out the toast.
   */
  fadeInterval?: number;

  /**
   * The duration (in milliseconds) for which the toast should remain visible.
   */
  duration?: number;

  /**
   * Indicates whether the toast should have a close button.
   */
  closeButton?: boolean;

  /**
   * Indicates whether the toast should be displayed immediately.
   */
  immediately?: boolean;

  /**
   * Indicates whether the toast should not close when clicked.
   */
  notOverClick?: boolean;

  /**
   * A callback function to execute when the toast is clicked.
   */
  onClick?: () => void;

  /**
   * Indicates whether the toast should persist (not auto-close).
   */
  persistent?: boolean;
}

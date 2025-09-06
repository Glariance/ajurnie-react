import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    meta?: {
      /** Show a success toast automatically if the request succeeds */
      successMessage?: string;
      /** Override default error message for the toast */
      errorMessage?: string;
      /** Suppress the global error toast for this request */
      suppressErrorAlert?: boolean;
      /** For this request, don't redirect to /login on 401 */
      dontRedirectOn401?: boolean;
    };
  }
}

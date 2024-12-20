declare global {
  interface Window {
    gapi: {
      load(
        apiName: string,
        callback: {
          (): void;
          onerror?: (error: Error) => void;
        }
      ): void;
      auth2: {
        init(options: {
          client_id: string;
          scope: string;
          fetch_basic_profile?: boolean;
        }): Promise<any>;
        getAuthInstance(): {
          signIn(options?: { scope?: string; prompt?: string }): Promise<any>;
          isSignedIn: {
            get(): boolean;
          };
          currentUser: {
            get(): {
              getBasicProfile(): {
                getName(): string;
                getEmail(): string;
              };
            };
          };
        };
      };
    };
  }
}

export {};

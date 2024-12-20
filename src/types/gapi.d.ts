interface Window {
  gapi: {
    load(api: string, callback: () => void): void;
    auth2: {
      init(params: { client_id: string }): Promise<any>;
      getAuthInstance(): {
        signIn(options: { scope: string }): Promise<any>;
      };
    };
  };
}

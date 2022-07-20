import '@jrel/http-shell/endpoints';

declare module '@jrel/http-shell/endpoints' {
  export interface Endpoints {
    'https://api.github.com/users/jrel': {
      login: string;
    };
    'https://api.github.com/error': {
      login: string;
    };
  }
}

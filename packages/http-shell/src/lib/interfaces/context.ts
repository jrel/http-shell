export type Context<TRes = unknown> = {
  status: number;
  $implicit: TRes;
};

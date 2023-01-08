/* eslint-disable */

export default {
  async fetch(
    request: Request,
    env: any,
    ctx: ExecutionContext
  ): Promise<Response> {
    return new Response(JSON.stringify({ request, env, ctx }));
  },
};

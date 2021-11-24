import { Component, Fragment, h, Helmet, serve, ssr } from "./deps.ts";

const Hello = () => {
  return <h1>Hello Nano App!</h1>;
};

const App = ({ children }: { children?: Component }) => (
  <Fragment>
    <Helmet>
      <title>Nano JSX SSR</title>
      <meta
        name="description"
        content="Server Side Rendered Nano JSX Application"
      />
    </Helmet>

    <Helmet footer>
      <div id="footer">This is footer</div>
    </Helmet>

    <h2>body</h2>
    <div id="sentence">This is body contents</div>
    {children}
  </Fragment>
);

const addr = ":8080";
if (!Deno.env.get("DENO_DEPLOYMENT_ID")) {
  console.log(`HTTP server listening on http://localhost${addr}`);
}

await serve(
  (request: Request) => {
    const { href, origin, host, pathname, hash, search } = new URL(request.url);
    console.log({ href, origin, host, pathname, hash, search });

    return ssr(() => (
      <App>
        <Hello />
      </App>
    ));
  },
  { addr },
);

import { Fragment, h, Helmet, renderSSR, serve } from "./deps.ts";

const Hello = () => {
  return <h1>Hello Nano App!</h1>;
};

const ensureStr = (strings?: string | string[]): string =>
  typeof strings === "string" ? strings : strings?.join("") || "";

const App = () => (
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
  </Fragment>
);

const html = ({ body, head, footer }: ReturnType<typeof Helmet.SSR>) => `
<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head?.join("")}
  </head>
  <body>
    ${renderSSR(<Hello />)}
    ${body}
    ${footer?.join("")}
  </body>
</html>`;

const addr = ":8080";
if (!Deno.env.get("DENO_DEPLOYMENT_ID")) {
  console.log(`HTTP server listening on http://localhost${addr}`);
}

await serve(
  (request: Request) => {
    const { href, origin, host, pathname, hash, search } = new URL(request.url);
    console.log({ href, origin, host, pathname, hash, search });

    const { body, head, footer } = Helmet.SSR(renderSSR(<App />));

    console.log({ body, head, footer });
    return new Response(html({ body, head, footer }), {
      headers: { "content-type": "text/html" },
    });
  },
  { addr },
);

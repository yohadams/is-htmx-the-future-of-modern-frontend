# Is HTMX the Future of Modern Frontend Development?

Probably not, but let's dive into it to check it out.

## Introduction

HTMX, though not a newcomer in the technology scene, has recently seen a surge in popularity, which some might attribute to enthusiastic advocacy from backend developers. This compact and robust library supports AJAX, CSS transitions, and even WebSocket, all facilitated through element attributes.

As a frontend developer with a background in the PHP/jQuery stack, I was initially skeptical about HTMX as it reminded me of that stack. Yet, over time, its simplicity and ease of implementation won me over. HTMX's minimal frontend requirements—just a few attributes—paired with any backend technology, make it a versatile choice.

For those interested, code examples are available on this [GitHub repository](https://github.com/yohadams/is-htmx-the-future-of-modern-frontend).

## Exploring HTMX in Action

Let't just take some modern javascript concepts and try to implement them with HTMX.

### The Counter Example

Consider a simple counter, akin to one you might find in a new React application:

```html
<span id="counter" hx-get="counter" hx-trigger="load">0</span>
<button hx-post="/increment" hx-target="#counter" hx-swap="outerHTML">
  Increment
</button>
```

Here, a `<span>` element fetches the current count from a `/counter` endpoint upon loading and updates its content with the response. The button, when clicked, sends a POST request to `/increment`, updating the targeted element with the new count.

Server-side pseudocode for this functionality might look like this:

```javascript
let counter = 0;
const counterElement = () => `<span id="counter">${counter}</span>`;

server.post("/increment", (_, res) => {
  counter++;
  res.send(counterElement());
});

server.get("/counter", (_, res) => {
  res.send(counterElement());
});
```

In this scenario, using a global variable for the counter allows its value to persist across page refreshes for all users.

### Server Sent Events (SSE)

For those unfamiliar with SSE, it represents a server push technology that enables the server to send updates to the client automatically, without the client needing to request for these updates repeatedly. This method facilitates a one-way communication stream from the server to the client, which is ideal for real-time features such as live notifications or updates.

While HTMX doesn't natively support SSE, it can be enabled with extensions. The setup involves specifying the server endpoint and the DOM element to update:

```html
<div hx-ext="sse" sse-connect="/subscribe-to-alerts" sse-swap="alert"></div>
```

Server-side handling might include:

```javascript
server.get("/subscribe-to-alerts", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("event: alert\n");
  res.write(`data: <span>Alert ${counter}</span>\n`);
  res.write(`id: ${counter}\n\n`);
});
```

As we can see event name is what we putted iniside od `sse-swap` attribute.

### Lazy loading

To create lazy loading with HTMX you need to add `hx-get` attribute to the element that will trigger the request. In this case it's the button. The `hx-trigger` attribute is set to `load`
which means that the request will be triggered when the element is loaded. The `hx-swap` attribute is set to `outerHTML` which means that the response will replace the element.

```html
<div hx-get="/generated-graph" hx-trigger="load" hx-swap="outerHTML">
  <span class="loading-spinner"></span>
</div>
```

This triggers a request when the element loads, replacing it with a server-generated graph:

```javascript
server.get("/generated-graph", (req, res) => {
  const graph = generateGraph(); // Assume this takes about 5 seconds to process.
  res.send(graph);
});
```

### Infinite Scrolling

HTMX can also facilitate infinite scrolling by triggering requests when an element is revealed on the screen:

```html
<tr hx-get="/users/?page=2" hx-trigger="revealed" hx-swap="afterend">
  <td>John Doe 5</td>
  <td>Frontend developer</td>
  <td>Team 1</td>
</tr>
```

Server-side logic to support this might involve:

```javascript
server.get("/users", (req, res) => {
  const page = parseInt(req.query.page, 10);
  const users = getUsers(page);
  let html = users
    .map(
      (user) => `
      <tr>
        <td>${user.name}</td>
        <td>${user.job}</td>
        <td>${user.team}</td>
      </tr>`
    )
    .join("");

  html += `
    <tr 
      hx-get="/users/?page=${page + 1}" 
      hx-trigger="revealed" 
      hx-swap="afterend">
    </tr>`;
  res.send(html);
});
```

## Conclusion

HTMX's design philosophy centers on accessibility and simplicity, reminiscent of jQuery's early appeal, yet it brings forward contemporary capabilities that are especially advantageous for lightweight projects or as a streamlined alternative to more complex JavaScript frameworks. Its compatibility with WebComponents points to its potential in supporting future hybrid applications.

On production sites, I can see it being used in some more static types of applications like blogs or e-commerce sites. It's a great tool for enhancing user experience without the need for complex frontend frameworks. It's also a great tool for backend developers who want to add some interactivity to their applications without the need to learn a lot of frontend technologies—pretty much just HTML and a couple of new attributes.

On a personal note, I've been utilizing HTMX as an enhancement tool in a family-run e-commerce business, where our site was initially built with PHP and jQuery. Incorporating HTMX involved simply appending a script to the site’s header. The transition involved transforming page updates from full refreshes to more elegant, HTMX-driven updates. This process was surprisingly straightforward, significantly enhancing site responsiveness and interactivity without a steep learning curve. The ease of integration and immediate improvements observed underscore the practical utility of HTMX, confirming its considerable potential for broader adoption in my future projects.

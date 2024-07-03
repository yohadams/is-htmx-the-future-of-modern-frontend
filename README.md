# Is HTMX the future of the modern frontend?

Probably no.

## Introduction

But regardless let's talk about it ;)

A little bit about HTMX itself: it's not that new, but lately, it has gained a lot of popularity (probably some backend developers' propaganda). It's small, robust, and does everything that a JS library should do - AJAX, CSS transitions, and even WebSocket support. And it accomplishes all this using element attributes.

As primarily a frontend developer, I was initially skeptical about it (I remember the days when I had to inject PHP variables inside JS scripts). However, after some time, I started to appreciate it. It's simple, easy to use, and not hard to implement. The best part is that you can use it with any backend technology you prefer.

Of course, you need a lot more on the backend side to make it work, but the frontend requires just a few attributes.

The link to GitHub repository with the code examples is [here](https://github.com/yohadams/is-htmx-the-future-of-modern-frontend)

## Where the magic happening

Lets just take some modern javascript concepts and convert it to HTMX way.

### The Counter

Let's start with implementation of simple counter like in fresh React app. We have a button that increments the counter and displays the value.

```html
<span id="counter" hx-get="counter" hx-trigger="load">0</span>
<button hx-post="/increment" hx-target="#counter" hx-swap="outerHTML">
  Increment
</button>
```

what we have here is span element that on load will make a request to `/counter` endpoint and replace the content of the element with the response. The button element on click will make a POST request to `/increment` endpoint and replace the content of element specified in `hx-target` attribute with the response.

and our server side pseudo code:

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

and depending of if we want to all users to see the same counter we can use `counter` as global variable or we can use session to store the counter value. In our example we are using global variable. So even after page refresh we get the same value.

Simple isn't it?

### SSE - Server Sent Events

For those who are not familiar with SSE, it's a server push technology that allows a server to send data to a client without the client having to request it. It's a one-way communication from the server to the client. The client subscribes to the event, and the server sends the data. The client can't send data to the server using SSE.

HTMX doesn't have built-in support for SSE, but we can use an extension for it (there is also an extension for WebSocket). The extension is called sse, and it's used by adding the hx-ext="sse" attribute to the element. The sse-connect attribute is used to specify the endpoint that will be connected to. The sse-swap attribute is used to specify the element that will be updated with the response.

```html
<div hx-ext="sse" sse-connect="/subscribe-to-alerts" sse-swap="alert"></div>
```

and our server side pseudo code:

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

and our server side pseudo code:

```javascript
server.get("/generated-graph", (req, res) => {
  const graph = generateGraph(); // lets assume it's send back the <svg /> and its generating 5 seconds
  res.send(graph);
});
```

### Infinite scroll

In this case we still using hx-get to make request, but as you can see we
added `hx-trigger="revealed"` which means that the request will be triggered when the element is scrolled into view. The `hx-swap` attribute is set to `afterend` which means that the response will be inserted after the element so in this case at the end of table and voile up we have infinite scrolling.

```html
<tr hx-get="/users/?page=2" hx-trigger="revealed" hx-swap="afterend">
  <td>John Doe 5</td>
  <td>Frontend developer</td>
  <td>Team 1</td>
</tr>
```

Of course you need to have a server that will handle the request and return the next page of the table. A lot is happening on backend side.

some pseudo code for the server side:

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

HTMX seems easy to use and it takes me back to the old times when I was using jQuery. For me personally i will try tu use it in some bigger project and compare it to React. But for now it's a great tool for small projects or for those who don't want to use JS frameworks.

One think i found is that you can use HTMX combined with WebComponents and i would want to try it in the future.

in fastify middleware, the req object is the raw node request object

https://www.fastify.io/docs/latest/Reference/Middleware/

Fastify middleware does not expose the send method or other methods specific to the Fastify Reply instance. This is because Fastify wraps the incoming req and res Node instances using the Request and Reply objects internally, but this is done after the middleware phase. If you need to create middleware, you have to use the Node req and res instances.

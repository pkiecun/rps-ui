import { rest } from 'msw'


export const handlers = [
    rest.get('http://localhost:8000/comp', (req, res, ctx) => {
      return res(ctx.json(2));
    }),
    rest.get('http://localhost:8000/user/authenticate', (req, res, ctx) => {
      return res(ctx.json(true));
    }),
    rest.get('http://localhost:8000/user/logout', (req, res, ctx) => {
        return res(ctx.status(200));
    }),
    rest.post('http://localhost:8000/user/login', (req, res, ctx) => {
        return res(
            ctx.json('this is my token'),
            ctx.status(200)
            );
    }),
    rest.post('http://localhost:8000/user/register', (req, res, ctx) => {
        return res(
            ctx.json('this is my token'),
            ctx.status(200)
            );
    }),

  ]


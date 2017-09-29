import * as restify from 'restify';
import * as corsMiddleware from 'restify-cors-middleware';

const api = restify.createServer();

const cors = corsMiddleware({ origins: ['*'], allowHeaders:[], exposeHeaders: [] });

api.pre(cors.preflight);
api.use(cors.actual);
api.use(restify.plugins.bodyParser());
api.use(restify.plugins.queryParser());

interface Todo {
    id: string;
    title: string;
    resolved: boolean;
}

let todos: Todo[] = [];

api.get('/get-todos', (req: restify.Request, res: restify.Response, next: restify.Next) => {
    res.send(todos);
    next();
});

api.post('/add-todo', (req: restify.Request, res: restify.Response, next: restify.Next) => {
    const todo: Todo = req.body;
    todo.id = Math.floor(Math.random() * 20).toString();
    todos = [todo, ...todos];
    res.send(todos);
    next();
});

api.del('/remove-todo/:id', (req: restify.Request, res: restify.Response, next: restify.Next) => {
    const index: number = todos.findIndex((todo) => todo.id === req.params.id);
    todos.splice(index, 1);
    res.send(todos);
    next();
});

api.put('/resolve-todo/:id', (req: restify.Request, res: restify.Response, next: restify.Next) => {
    const todo: Todo = todos.find((todo) => todo.id === req.params.id);
    todo.resolved = true;
    res.send(todos);
    next();
});

api.listen(3001, function () {
    console.log('sever is listening');
});

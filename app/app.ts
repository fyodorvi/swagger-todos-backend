import * as restify from 'restify';
import * as corsMiddleware from 'restify-cors-middleware';
import {ITodoApiController, Todo, TodoApiRouter} from "./generated-interface";

const api = restify.createServer();

const cors = corsMiddleware({ origins: ['*'], allowHeaders:[], exposeHeaders: [] });

api.pre(cors.preflight);
api.use(cors.actual);
api.use(restify.plugins.bodyParser());
api.use(restify.plugins.queryParser());

let todos: Todo[] = [];

class TodoController implements ITodoApiController {

    async resolveTodo(parameters: { id: string }): Promise<Array<Todo>> {
        const todo: Todo = todos.find((todo) => todo.id === parameters.id);
        todo.resolved = true;
        return todos;
    }

    async removeTodo(parameters: { id: string }): Promise<Array<Todo>> {
        const index: number = todos.findIndex((todo) => todo.id === parameters.id);
        todos.splice(index, 1);
        return todos;
    }

    async addTodo(parameters: { body?: Todo }): Promise<Array<Todo>> {
        const todo = new Todo();
        todo.id = Math.floor(Math.random() * 20).toString();
        todo.title = parameters.body.title;
        todo.resolved = false;

        todos = [todo, ...todos];
        return todos;
    }

    async getTodos(parameters: {}): Promise<Array<Todo>> {
        return todos;
    }
}

const todoController = new TodoController();
const todoRouter = new TodoApiRouter(api, todoController);

todoRouter.registerRoutes();

api.listen(3001, function () {
    console.log('sever is listening');
});

import {test, expect} from '@playwright/test';
import z from 'zod';

const todoSchema = z.object({
    userId: z.number().int().positive().describe("ID of the user who owns the todo"),
    id: z.number().int().positive().describe("Unique identifier for the todo item"),
    title: z.string().min(1).max(500).describe("Title/description of the todo task"),
    completed: z.boolean().describe("Whether the todo task is completed or not")
});


const baseUrl = process.env.baseUrl;

test('Get all todos API tests', async ({ request }) => {
    const response = await request.get(`${baseUrl}/todos`);

    const responseJSON = await response.json();

    for (let i = 0; i < responseJSON.length; i++) {
        todoSchema.parse(responseJSON[i]);
    }

    console.log('Number of todos:', responseJSON.length);
});

test('Get all todos with dynamic ID', async ({ request }) => {
    const allTodosResponse = await request.get(`${baseUrl}/todos`);
    const allTodos = await allTodosResponse.json();

    const todoId = allTodos[0].id;
    console.log('Dynamically fetched Todo ID:', todoId);

        const singleTodoResponse = await request.get(`${baseUrl}/todos/${todoId}`);
        const singleTodo = await singleTodoResponse.json();

        todoSchema.parse(singleTodo);
        expect(singleTodoResponse.status()).toBe(200);
        console.log('Single Todo details:', singleTodo);
    }       
);
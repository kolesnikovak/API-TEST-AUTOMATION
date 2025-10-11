import { test, expect } from '@playwright/test';
import z from 'zod';

const baseUrl = process.env.baseUrl;

test('Create a new todo', async ({ request }) => {
    const newTodoRequestBody = {
        "userId": 1,
        "title": "delectus aut autem",
        "completed": false
    }
    const createTodoResponse = await request.post(`${baseUrl}/todos`, { data: newTodoRequestBody });

    expect(createTodoResponse.status()).toBe(201)

    const expectedResponseSchema = z.object({
        userId: z.literal(newTodoRequestBody.userId),
        id: z.number().positive(),
        title: z.literal(newTodoRequestBody.title),
        completed: z.literal(newTodoRequestBody.completed)
    });

    const actualResponseJSON = await response.json()
    expectedResponseSchema.parse(actualResponseJSON);
});
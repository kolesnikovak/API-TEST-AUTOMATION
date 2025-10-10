import {test, expect} from '@playwright/test';
import z from 'zod';

const postSchema = z.object({
    userId: z.number().int().positive().describe("ID of the user who created the post"),
    id: z.number().int().positive().describe("Unique identifier for the post"),
    title: z.string().min(1).max(200).describe("Title of the post"),
    body: z.string().min(1).max(5000).describe("Content body of the post")
});

const baseUrl = process.env.BASE_URL;

test('Get all posts API tests', async ({ request }) => {
    const response = await request.get(`${baseUrl}/posts`);

    const status = response.status();
    const responseJSON = await response.json();

    expect(status).toBe(200);

    for (let i = 0; i < responseJSON.length; i++) {
        postSchema.parse(responseJSON[i]);
    }

    console.log('Number of posts:', responseJSON.length);
});



test('Get single post and code response API tests', async ({ request }) => {
    const postId = 5;
    const response = await request.get(`${baseUrl}/posts/${postId}`);

    const status = response.status();
    const responseJSON = await response.json();

    expect(status).toBe(200);

    postSchema.parse(responseJSON);

    console.log('Post details:', responseJSON);
});
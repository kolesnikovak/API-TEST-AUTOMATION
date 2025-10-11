import { test, expect } from '@playwright/test';
import z from 'zod';
import { faker } from '@faker-js/faker';

const postSchema = z.object({
    userId: z.number().int().positive().describe("ID of the user who created the post"),
    id: z.number().int().positive().describe("Unique identifier for the post"),
    title: z.string().min(1).max(200).describe("Title of the post"),
    body: z.string().min(1).max(5000).describe("Content body of the post")
});

const baseUrl = process.env.baseURL;

test ('Replace a post with userId and verify the expected user is correct', async ({request}) => {
        const postRequestBody = {
            "userId": 1,
            "id": 1,
            "title": faker.lorem.sentence(),
            "body": faker.lorem.paragraph()
        };


        const replacedPostResponse = await request.put(`${baseUrl}/posts/${postRequestBody.id}`, {
            data: postRequestBody
        });
        
        expect(replacedPostResponse.status()).toBe(200);

        const expectedPostSchema = z.object({
            userId: z.literal(postRequestBody.userId),
            id: z.literal(postRequestBody.id),
            title: z.literal(postRequestBody.title),
            body: z.literal(postRequestBody.body)
        });

        const responseJSON = await replacedPostResponse.json();
        expectedPostSchema.parse(responseJSON);
    });
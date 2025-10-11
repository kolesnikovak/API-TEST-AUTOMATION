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


        const replacePostResponse = await request.put(`${baseUrl}/posts/${postRequestBody.id}`, {
            data: postRequestBody
        });
        
        expect(replacePostResponse.status()).toBe(200);

        const expectedPostSchema = z.object({
            userId: z.literal(postRequestBody.userId),
            id: z.literal(postRequestBody.id),
            title: z.literal(postRequestBody.title),
            body: z.literal(postRequestBody.body)
        });

        const responseJSON = await replacePostResponse.json();
        expectedPostSchema.parse(responseJSON);
    });


    test('Patch a post and verify the expected fields are correct', async ({ request }) => {
        const patchRequestBody = {
            "userId": faker.number.int({ min: 1, max: 10 }),
            "id": faker.number.int({ min: 1, max: 100 }),
            "title": faker.lorem.sentence(),
            "body": faker.lorem.paragraph()
        };

        const patchedPostResponse = await request.patch(`${baseUrl}/posts/${patchRequestBody.id}`, {
            data: patchRequestBody
        });

        expect(patchedPostResponse.status()).toBe(200);

        const expectedPatchedPostSchema = z.object({
            userId: z.literal(patchRequestBody.userId),
            id: z.literal(patchRequestBody.id),
            title: z.literal(patchRequestBody.title),
            body: z.literal(patchRequestBody.body)
        });

        const responseJSON = await patchedPostResponse.json();
        expectedPatchedPostSchema.parse(responseJSON);
    });


    test('Delete a post and verify the response status code', async ({ request }) => {
        const postId = faker.number.int({ min: 1, max: 100 });

        const deletePostResponse = await request.delete(`${baseUrl}/posts/${postId}`);

        expect(deletePostResponse.status()).toBe(200);
    });
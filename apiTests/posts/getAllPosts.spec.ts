import {test, expect} from '@playwright/test';
import z from 'zod';
import { faker } from '@faker-js/faker';

const postSchema = z.object({
    userId: z.number().int().positive().describe("ID of the user who created the post"),
    id: z.number().int().positive().describe("Unique identifier for the post"),
    title: z.string().min(1).max(200).describe("Title of the post"),
    body: z.string().min(1).max(5000).describe("Content body of the post")
});

const baseUrl = process.env.baseURL;

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

test('Get a comments for a post API tests', async ({ request }) => {
    const postId = 5;
    const response = await request.get(`${baseUrl}/posts/${postId}/comments`);

    const status = response.status();
    const responseJSON = await response.json();


    for (let i = 0; i < responseJSON.length; i++) {
        postSchema.parse(responseJSON[i]);
    }

    test('Get all posts with dynamic ID', async ({ request }) => {
    const allPostsResponse = await request.get(`${baseUrl}/posts`);
    const allPostsJSONResponse = await allPostsResponse.json();
    
    const postId = allPostsJSONResponse[0].id;
   

    const singlePostResponse = await request.get(`${baseUrl}/posts/${postId}`);
    const singlePostJSONResponse = await singlePostResponse.json();

    postSchema.parse(singlePostJSONResponse);
    expect(singlePostResponse.status()).toBe(200);
    console.log('Single Post details:', singlePostJSONResponse);
});

test ('Get post with userId and verify the expected user is correct', async ({request}) => {
    const response = await request.get(`${baseUrl}/posts`);
    const responseJSON = await response.json();

    const userId = responseJSON[0].userId;

    const postResponse = await request.get(`${baseUrl}/posts`, {
        params: { userId: userId }
    });
    const postResponseJSON = await postResponse.json();

    expect(postResponse.status()).toBe(200);

    for (let i = 0; i < postResponseJSON.length; i++) {
        postSchema.parse(postResponseJSON[i]);
    }
    console.log(`Posts for userId ${userId}:`, postResponseJSON);
})
})

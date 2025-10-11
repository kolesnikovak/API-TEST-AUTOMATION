import {test, expect} from '@playwright/test';
import z from 'zod';

const albumSchema = z.object({
    userId: z.number().int().positive().describe("ID of the user who owns the album"),
    id: z.number().int().positive().describe("Unique identifier for the album"),
    title: z.string().min(1).describe("Title of the album")
});

const baseURL = process.env.baseURL;

test ('Get all albums API test', async ({request}) => {
    const response = await request.get(`${baseURL}/albums`);
    const responseJSON = await response.json();

    expect(response.status()).toBe(200);

    for(let i = 0; i < responseJSON.length; i++) {
        albumSchema.parse(responseJSON[i]);
    }
    console.log('Number of albums:', responseJSON.length);
})

test ('Get all albums with dynamic ID', async ({request}) => {
    const response = await request.get(`${baseURL}/albums`);
    const responseJSON = await response.json();

    const albumId = responseJSON[0].id;

    const albumResponse = await request.get(`${baseURL}/albums/${albumId}`);
    const albumResponseJSON = await albumResponse.json();

    albumSchema.parse(albumResponseJSON);
    expect(albumResponse.status()).toBe(200);
    console.log('Single Album details:', albumResponseJSON);
})
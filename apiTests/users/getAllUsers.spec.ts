import {test, expect} from '@playwright/test';
import z from 'zod';

//  schema check -> structure validation
const userSchema = z.object({
    id: z.number().min(0),
    name: z.string().min(2),
    username: z.string().min(2),
    email: z.string(),
    address: z.object({
        street: z.string(),
        suite: z.string(),
        city: z.string(),
        zipcode: z.string().min(5).max(12),
        geo: z.object({
            lat: z.string(),
            lng: z.string()
        })
    }),
    phone: z.string(),
    website: z.string(),
    company: z.object({
        name: z.string(),
        catchPhrase: z.string(),
        bs: z.string()
    })
});

const baseUrl = process.env.baseUrl;

test('Get all users API tests', async ({ request }) => {
    // get all users with https://jsonplaceholder.typicode.com/users
    const response = await request.get(`${baseUrl}/users`)

    const status = response.status()
    const responseJSON = await response.json()

    // status code check -> expecting 200
    expect(status).toBe(200)

    // schema validation
    for (let i = 0; i < responseJSON.length; i++) {
        userSchema.parse(responseJSON[i]);
    }

    console.log('Number of users:', responseJSON.length);
})
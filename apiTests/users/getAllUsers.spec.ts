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

const baseUrl = process.env.baseURL;

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

test('Validate status code and schema for single user', async ({ request }) => {
    const userRequestBody = {
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret",
        "email": "Sincere@april.biz",
        "address": {
            "street": "Kulas Light",
            "suite": "Apt. 556",
            "city": "Gwenborough",
            "zipcode": "92998-3874",
            "geo": {
                "lat": "-37.3159",
                "lng": "81.1496"
            }
        },
        "phone": "1-770-736-8031 x56442",
        "website": "hildegard.org",
        "company": {
            "name": "Romaguera-Crona",
            "catchPhrase": "Multi-layered client-server neural-net",
            "bs": "harness real-time e-markets"
        }
    };

    const createdUserResponse = await request.post(`${baseUrl}/users`)
    expect(createdUserResponse.status()).toBe(201)

    const expectedResponseSchema = z.object({
        id: z.literal(userRequestBody.id),
        name: z.literal(userRequestBody.name),
        username: z.literal(userRequestBody.username),
        email: z.literal(userRequestBody.email),
        address: z.object({
            street: z.literal(userRequestBody.address.street),
            suite: z.literal(userRequestBody.address.suite),
            city: z.literal(userRequestBody.address.city),
            zipcode: z.literal(userRequestBody.address.zipcode),
            geo: z.object({
                lat: z.literal(userRequestBody.address.geo.lat),
                lng: z.literal(userRequestBody.address.geo.lng)
            })
        }),
        phone: z.literal(userRequestBody.phone),
        website: z.literal(userRequestBody.website),
        company: z.object({
            name: z.literal(userRequestBody.company.name),
            catchPhrase: z.literal(userRequestBody.company.catchPhrase),
            bs: z.literal(userRequestBody.company.bs)
        })
    });

    const actualResponseJSON = await createdUserResponse.json()

    expectedResponseSchema.parse(actualResponseJSON);
    console.log('Single user details:', actualResponseJSON);
});
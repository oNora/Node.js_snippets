# Homework Assignment #2 & #3 - pizza delivery API
 This projec is created as a Homework for the [The Node.js Master Class](https://www.pirple.com/) The first part (Homework Assignment #2) is to create an API for pizza delivary and the second one (Homework Assignment #3) is to create an UI for it.


## 1. API Requirement

Build an API for a pizza-delivery company. No frontend required, just the API with the following specifications:

1. New users can be created, their information can be edited, and they can be deleted. We should store their name, email address, and street address.

2. Users can log in and log out by creating or destroying a token.

3. When a user is logged in, they should be able to GET all the possible menu items (these items can be hardcoded into the system).

4. A logged-in user should be able to fill a shopping cart with menu items

5. A logged-in user should be able to create an order.Use the Sandbox of Stripe.com to accept their payment. Note: Use the stripe sandbox for your testing. Follow this link and click on the "tokens" tab to see the fake tokens you can use server-side to confirm the integration is working: https://stripe.com/docs/testing#cards

6. When an order is placed, you should email the user a receipt. Use the sandbox of Mailgun.com for this. Note: Every Mailgun account comes with a sandbox email account domain (whatever@sandbox123.mailgun.org) that you can send from by default. So, there's no need to setup any DNS for your domain for this task https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account

## 2. UI Requirement

1. Signup on the site
2. View all the items available to order
3. Fill up a shopping cart



## API calls
Use Postman to test the API

### 1. Users

Possible methods: `post`, `get`, `put` and `delete`

POST **Request URL**: (yourHost)/users <br/>
POST accepted params (use existing data):

<pre>
{
   "firstName":"John",
   "lastName":"Smit",
   "phone":"5551234568",
   "email": "test@mail.com",
   "password":"ThisIsAPassword",
   "address" : "24A Some str., Sofia",
   "tosAgreement":true
} </pre>


GET **Request URL**: (yourHost)/users?phone=(Existing user's phone) <br/>
Make sure you have a **valid token**! <br />
Expected response:

<pre>{
    "firstName": "John",
    "lastName": "Smit",
    "email": "test@mail.com",
    "address": "24A Some str., Sofia"
}</pre>

PUT **Request URL**: (yourHost)/users <br/>
PUT accepted params (use existing data):

<pre>
{
"firstName":"John 2",
"phone":"5551234568",
} </pre>

DELETE **Request URL**: (yourHost)/users?phone=(Existing user's phone) <br/>
Make sure you have a **valid token**!

### 2. Token

Possible methods: `post`, `get`, `put` and `delete`

POST **Request URL**: (yourHost)tokens <br/>
POST accepted params (use existing data):

<pre>
 {
  "phone":"5551234568",
  "password":"ThisIsAPassword",
 } </pre>


GET **Request URL**: (yourHost)/tokens?id=(Existing token id) <br/>
Expected response:

<pre>{
    "phone": "5551234568",
    "id": "jcop6t98heyua0oin0kw",
    "expires": 1602073932966
}</pre>

PUT **Request URL**: (yourHost)/tokens <br/>
PUT accepted params (use existing data):

<pre>
{
"id":"jcop6t98heyua0oin0kw",
"extend": true,
} </pre>

DELETE **Request URL**: (yourHost)/tokens?phone=(Existing user's phone) <br/>
Make sure you have a **valid token**!


### 3. Menu

Possible methods: `get`


GET **Request URL**: (yourHost)/menu?phone=(Existing user's phone) <br/>
Make sure you have a **valid token**! <br />
Expected response:

<pre>[
    {
        "id": 1,
        "name": "Pepperoni",
        "price": 10.99
    },
    {
        "id": 2,
        "name": "Garden Classic",
        "price": 11.99
    },
    {
        "id": 3,
        "name": "Vegan",
        "price": 12.99
    },
    {
        "id": 4,
        "name": "Hawaiian",
        "price": 13.99
    }
]</pre>


### 4. Shopping card

Possible methods: `post`, `get`, `put` and `delete`

POST **Request URL**: (yourHost)/shoppingCard <br/>
POST accepted params (use existing data). Must have at least one menu item:

<pre>
{
  "userPhone": "palleeb7tohvptnl611r",
   "menuItems": [
        {
            "id": 3,
            "itemName": "Vegan",
            "quantity" : 2,
            "singlePrice": 12.99
        }
]} </pre>


GET **Request URL**: (yourHost)/shoppingCard?orderId=(Existing order's phone)&phone=(Existing user's phone) <br/>
Make sure you have a **valid token**! <br />
Expected response:

<pre>{
    "orderId": "8q14kyby83",
    "userPhone": "5551234568",
    "userEmail": "az_iskam@mail.bg",
    "menuItems": [{
        "id": 3,
        "itemName": "Vegan",
        "quantity": 2,
        "singlePrice": 12.99,
        "totalItemPrice": 25.98
    }],
    "orderTotalPrice": 25.98
}</pre>

PUT **Request URL**: (yourHost)/shoppingCard <br/>
Make sure you have a **valid token**! <br />
PUT accepted params (use existing data):

<pre>
 {
  "phone": "8q14kyby83",
   "menuItems": [
        {
            "id": 3,
            "itemName": "Vegan",
            "quantity" : 2,
            "singlePrice": 12.99
        }
    ]
 } </pre>

DELETE **Request URL**: (yourHost)/shoppingCard?orderId=(Existing order's phone)&phone=(Existing user's phone)  <br/>
Make sure you have a **valid token**!

### 5. Payment

Possible methods: `post`

POST **Request URL**: (yourHost)/payment <br/>
Make sure you have a **valid token**!
POST accepted params (use existing data). Must have at least one menu item:

<pre>
 {
 "orderId":"8q14kyby83",
 "userPhone": "5551234568",
 "cardNumber": "4242424242424242",
 "cardExpiryDate": "07.07.2022",
 "cardHolder": "John Smit",
 "cardCVVCode": "545"
 } </pre>

 For credit card info follow this link https://stripe.com/docs/testing#cards

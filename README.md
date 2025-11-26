Sure! Here’s a **full `README.md`** file you can copy and paste directly into your project:

````markdown
# Student API with WSO2 OAuth2 Authentication

This project demonstrates how to secure a Node.js + TypeScript API using **WSO2 Identity Server (IS)** OAuth2 tokens, with optional API publishing via **WSO2 API Manager (APIM)**.

---

## Features

- User registration and login using Node.js + MongoDB.  
- OAuth2 token validation using WSO2 Identity Server.  
- `wso2Authenticate` middleware for token introspection.  
- Optional API publishing via WSO2 API Manager.  

---

## Requirements

- Node.js >= 18  
- MongoDB (Atlas or local)  
- WSO2 Identity Server  
- (Optional) WSO2 API Manager  

---

## Setup

1. **Clone the repository**:

```bash
git clone <repo-url>
cd <repo-folder>
````

2. **Install dependencies**:

```bash
npm install
```

3. **Create `.env` file**:

```env
PORT=5000
MONGO_DB_URI=<your_mongodb_connection_string>

# WSO2 IS OAuth2 introspection
JWT_INTROSPECTION_URL=https://localhost:9443/oauth2/introspect
INTROSPECTION_CLIENT_ID=<your_is_client_id>
INTROSPECTION_CLIENT_SECRET=<your_is_client_secret>
```

4. **Start the server**:

```bash
npm run dev
```

---

## API Endpoints

| Endpoint                | Method | Description                                       |
| ----------------------- | ------ | ------------------------------------------------- |
| `/api/v1/auth/register` | POST   | Register a new user                               |
| `/api/v1/auth/login`    | POST   | Login and get access token                        |
| `/students`             | GET    | Get all students (secured, requires Bearer token) |

---

## Testing the API

1. **Get an access token from WSO2 IS**:

```bash
curl -X POST \
  -u "<INTROSPECTION_CLIENT_ID>:<INTROSPECTION_CLIENT_SECRET>" \
  -d "grant_type=client_credentials&scope=default" \
  "https://localhost:9443/oauth2/token"
```

* Replace `<INTROSPECTION_CLIENT_ID>` and `<INTROSPECTION_CLIENT_SECRET>` with your values.
* Copy the `access_token` from the response.

2. **Call a secured endpoint**:

```bash
curl -X GET http://localhost:5000/students \
  -H "Authorization: Bearer <access_token>"
```

* Replace `<access_token>` with the token obtained from WSO2 IS.

---

## Notes

* For local WSO2 IS with self-signed certificates, you may need to disable TLS verification in Node.js:

```js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
```

* When using **APIM**, you can let APIM validate tokens and forward user info via headers. In that case, backend introspection is optional.

---

## References

* [WSO2 IS OAuth2 Documentation](https://is.docs.wso2.com/en/latest/)
* [WSO2 API Manager Documentation](https://apim.docs.wso2.com/en/latest/)

---

## Author

Haritha — Node.js & WSO2 Integration

```

---

This README is ready to **copy-paste** into your project and provides:

- Setup instructions  
- Environment variables  
- How to test with Postman/cURL  
- Notes on WSO2 specifics  

If you want, I can also make a **slimmer GitHub-friendly version** under 1 page for a clean look.  

Do you want me to do that?
```

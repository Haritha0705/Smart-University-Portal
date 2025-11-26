# Student API with WSO2 OAuth2 Authentication

A Node.js + TypeScript API secured with **WSO2 Identity Server (IS)** OAuth2 tokens, optionally publishable via **WSO2 API Manager (APIM)**.

---

## Features

- User registration and login with Node.js + MongoDB  
- OAuth2 token validation via WSO2 Identity Server  
- `wso2Authenticate` middleware for token introspection  
- Optional API publishing via WSO2 API Manager  

---

## Requirements

- Node.js >= 18  
- MongoDB (local or Atlas)  
- WSO2 Identity Server  
- (Optional) WSO2 API Manager  

---

## Setup

1. **Clone the repository**:

```bash
git clone <repo-url>
cd <repo-folder>
```

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

2. **Call a secured endpoint**:

```bash
curl -X GET http://localhost:5000/students \
  -H "Authorization: Bearer <access_token>"
```

*Replace placeholders with your actual values.*

---

## Notes

- For local WSO2 IS with self-signed certificates, disable TLS verification in Node.js:

```js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
```

- With APIM, token validation can be handled by the API Manager; backend introspection becomes optional.

---

## References

- [WSO2 IS OAuth2 Docs](https://is.docs.wso2.com/en/latest/)  
- [WSO2 API Manager Docs](https://apim.docs.wso2.com/en/latest/)

---

## Author

Haritha — Node.js & WSO2 Integration

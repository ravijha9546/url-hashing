# URL Hashing System

This project provides a URL shortening service that generates a hashed version of long URLs, allowing users to track clicks while preserving the integrity and privacy of the original URLs. The service is built using AWS Lambda, DynamoDB, and Express.js.

## Features

- **Shorten URLs**: Generate short hashed URLs for long URLs.
- **Click Tracking**: Track the number of clicks on each shortened URL.
- **Privacy**: The original URL is not exposed in the public domain.
- **Single Use**: URLs can be generated for single or limited use.

## Technologies Used

- AWS Lambda
- AWS DynamoDB
- Express.js
- Node.js
- AWS SDK for JavaScript

## API Endpoints

1. **POST /shorten**
   - Description: Shortens the provided URL.
   - Request Body: `{ "originalUrl": "https://example.com" }`
   - Response: `{ "hash": "shortHashValue", "originalUrl": "https://example.com" }`

2. **GET /r/:hash**
   - Description: Redirects to the original URL based on the hash.
   - Parameters: `hash` - The shortened hash.
   - Response: Redirects to the original URL.

3. **GET /details/:hash**
   - Description: Retrieves details about the shortened URL, including the original URL and click count.
   - Parameters: `hash` - The shortened hash.
   - Response: `{ "originalUrl": "https://example.com", "clickCount": 10 }`

## Getting Help

If you encounter any issues or have questions, feel free to open an issue in the repository or contact the maintainer.

## License

This project is licensed under the MIT License.


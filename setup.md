# Setup Instructions

Follow these instructions to set up and deploy the URL Hashing System.

## Prerequisites

- Node.js (version 14.x or higher)
- AWS Account
- AWS CLI configured with your account credentials

## Environment Variables

Create a `.env` file in the root directory with the following environment variable:

```plaintext
USERS_TABLE=your-dynamodb-table-name

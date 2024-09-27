const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");
const crypto = require("crypto");

const app = express();
const USERS_TABLE = process.env.USERS_TABLE; // Keep this for DynamoDB table name
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

// Shorten URL
app.post("/shorten", async (req, res) => {
  console.log("Received request:", req.body);
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "Missing original URL" });
  }

  // Generate a hash for the original URL
  const hash = crypto.createHash("sha256").update(originalUrl).digest("hex").slice(0, 10); // Shorten to 10 chars

  const params = {
    TableName: USERS_TABLE,
    Item: {
      hash: hash,
      originalUrl: originalUrl,
      clickCount: 0, // Initialize click count
    },
  };

  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    return res.status(200).json({ hash: hash, originalUrl: originalUrl });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not create shortened URL" });
    
  }
  
});

// Redirect based on hash
app.get("/r/:hash", async (req, res) => {
  const hash = req.params.hash;

  const params = {
    TableName: USERS_TABLE,
    Key: {
      hash: hash,
    },
  };

  try {
    const command = new GetCommand(params);
    const { Item } = await docClient.send(command);
    if (Item) {
      // Increment the click count
      const updateParams = {
        TableName: USERS_TABLE,
        Key: {
          hash: hash,
        },
        UpdateExpression: "SET clickCount = clickCount + :increment",
        ExpressionAttributeValues: {
          ":increment": 1,
        },
      };
      
      await docClient.send(new UpdateCommand(updateParams));
      return res.redirect(Item.originalUrl); // Redirect to original URL
    } else {
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not retrieve URL" });
  }
});

// Get URL details including click count
app.get("/details/:hash", async (req, res) => {
  const hash = req.params.hash;

  const params = {
    TableName: USERS_TABLE,
    Key: {
      hash: hash,
    },
  };

  try {
    const command = new GetCommand(params);
    const { Item } = await docClient.send(command);
    if (Item) {
      return res.json({ originalUrl: Item.originalUrl, clickCount: Item.clickCount });
    } else {
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not retrieve URL" });
  }
});

// Handle 404 errors
app.use((req, res) => {
  return res.status(404).json({ error: "Not Found" });
});

// Serverless export
exports.handler = serverless(app);
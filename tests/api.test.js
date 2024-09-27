const request = require('supertest');
const express = require('express');
const serverless = require('serverless-http');
const app = require('../handler');

describe('URL Hashing System API', () => {
  it('should shorten a URL', async () => {
    const response = await request(app)
      .post('/shorten')
      .send({ originalUrl: 'https://example.com' });
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('hash');
    expect(response.body.originalUrl).toBe('https://example.com');
  });

  it('should return a 400 error if originalUrl is missing', async () => {
    const response = await request(app).post('/shorten').send({});
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing original URL');
  });

  it('should redirect to the original URL', async () => {
    const shortenResponse = await request(app)
      .post('/shorten')
      .send({ originalUrl: 'https://example.com' });

    const hash = shortenResponse.body.hash;
    const redirectResponse = await request(app).get(`/r/${hash}`);
    
    expect(redirectResponse.status).toBe(302);
    expect(redirectResponse.headers.location).toBe('https://example.com');
  });

  it('should return 404 for a non-existing hash', async () => {
    const response = await request(app).get('/r/nonexistentHash');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'URL not found');
  });

  it('should get URL details', async () => {
    const shortenResponse = await request(app)
      .post('/shorten')
      .send({ originalUrl: 'https://example.com' });

    const hash = shortenResponse.body.hash;
    const detailsResponse = await request(app).get(`/details/${hash}`);
    
    expect(detailsResponse.status).toBe(200);
    expect(detailsResponse.body.originalUrl).toBe('https://example.com');
    expect(detailsResponse.body).toHaveProperty('clickCount', 0);
  });

  it('should return 404 for details of a non-existing hash', async () => {
    const response = await request(app).get('/details/nonexistentHash');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'URL not found');
  });
});

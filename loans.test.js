//tests/loans.test.js
const request = require('supertest');
const app = require('../app');
const Loan = require('../models/loanModel');

describe('Loan Routes', () => {
  it('should create a new loan', async () => {
    const res = await request(app)
      .post('/api/loans')
      .send({
        borrowerName: 'John Doe',
        amount: 5000,
        interestRate: 5,
        termInMonths: 12,
      })
      .set('Authorization', `Bearer YOUR_TEST_JWT`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('loan');
  });

  it('should fetch all loans', async () => {
    const res = await request(app).get('/api/loans').set('Authorization', `Bearer YOUR_TEST_JWT`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('loans');
  });
});



import { registerDRC } from '../controllers/DRC_controller.js'; // Adjust the path to your controller file

jest.mock('../config/db.js', () => ({
  mysqlConnection: {
    query: jest.fn(), // Mock query 

  },
}));

describe('registerDRC Controller', () => {
  
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  
  afterAll(() => {
    console.error.mockRestore();
  });

  const mockReq = (body) => ({ body });
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should return 400 if required fields are missing', async () => {
    const req = mockReq({ abbreviation: '', drc_name: '', service_id: '', teli_no: '' });
    const res = mockRes();

    await registerDRC(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required.' });
  });

  it('should return 201 if DRC is registered successfully', async () => {
    const req = mockReq({
      abbreviation: 'DRC1',
      drc_name: 'Debt Recovery Co.',
      service_id: '123',
      teli_no: '0112345678',
    });
    const res = mockRes();

    // Mock successful db

    const db = require('../config/db.js');

    db.mysqlConnection.query.mockImplementation((query, values, callback) => {
      callback(null, { insertId: 1 }); // Mock insertId for new datarecords
    });

    await registerDRC(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'DRC registered successfully.',
      data: expect.objectContaining({
        drc_id: 1,
        abbreviation: 'DRC1',
        drc_name: 'Debt Recovery Co.',
        service_id: '123',
        teli_no: '0112345678',
        drc_status: 'Active',
        drc_end_dat: '',
        created_by: 'Admin',
        created_dtm: expect.any(String),
      }),
    });
  });

  it('should return 500 if database error occurs', async () => {
    const req = mockReq({
      abbreviation: 'DRC1',
      drc_name: 'Debt Recovery Co.',
      service_id: '123',
      teli_no: '0112345678',
    });
    const res = mockRes();

    // Mock db error


    const db = require('../config/db.js');

    db.mysqlConnection.query.mockImplementation((query, values, callback) => {
      callback(new Error('Database error'), null);
    });

    await registerDRC(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Database error',
      error: expect.any(Error),
    });
  });
});

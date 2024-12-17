/* Purpose: Test getRODetailsByID function.
   Created Date: 2024-12-06
   Created By: Dinusha Anupama (dinushanupama@gmail.com)
   Last Modified Date: 2024-12-06
   Modified By: Dinusha Anupama (dinushanupama@gmail.com)
   Version: Node.js v20.11.1
   Dependencies: mysql2, Jest
   Related Files: db.js
   Notes: */

   import { getRODetailsByID } from '../controllers/RO_controller.js';

   jest.mock('../config/db.js', () => ({
     mysqlConnection: {
       query: jest.fn(),
     },
   }));
   
   describe('getRODetailsByID Controller', () => {
     beforeAll(() => {
       jest.spyOn(console, 'error').mockImplementation(() => {});
     });
   
     afterAll(() => {
       console.error.mockRestore();
     });
   
     const mockReq = (body = {}) => ({ body });
     const mockRes = () => {
       const res = {};
       res.status = jest.fn().mockReturnValue(res);
       res.json = jest.fn().mockReturnValue(res);
       return res;
     };
   
     it('should return 200 and recovery officer details when ro_id is found', async () => {
       const req = mockReq({ ro_id: 1 });
       const res = mockRes();
   
       const db = require('../config/db');
       db.mysqlConnection.query.mockImplementation((query, values, callback) => {
         if (values[0] === 1) {
           callback(null, [
             {
               ro_id: 1,
               ro_name: 'Smith',
               ro_contact_no: 778541258,
               drc_id: 1,
               login_type: 'Google',
               ro_status: 'Active',
               login_user_id: '12345678',
               remark: null,
             },
           ]); // Simulating a found recovery officer
         } else {
           callback(null, []); // Simulating no officer found
         }
       });
   
       await getRODetailsByID(req, res);
   
       expect(res.status).toHaveBeenCalledWith(200);
       expect(res.json).toHaveBeenCalledWith({
         status: 'success',
         message: 'Recovery Officer retrieved successfully.',
         data: {
           ro_id: 1,
           ro_name: 'Smith',
           ro_contact_no: 778541258,
           drc_id: 1,
           ro_status: 'Active',
           login_type: 'Google',
           login_user_id: '12345678',
           remark: null,
         },
       });
     });
   
     it('should return 404 if no recovery officer is found by ro_id', async () => {
       const req = mockReq({ ro_id: 999 });
       const res = mockRes();
   
       const db = require('../config/db');
       db.mysqlConnection.query.mockImplementation((query, values, callback) => {
         callback(null, []); // Simulating no officer found for ro_id 999
       });
   
       await getRODetailsByID(req, res);
   
       expect(res.status).toHaveBeenCalledWith(404);
       expect(res.json).toHaveBeenCalledWith({
         status: 'error',
         message: 'No Recovery Officer found with ro_id: 999.',
       });
     });
   
     it('should return 500 if a database error occurs', async () => {
       const req = mockReq({ ro_id: 1 });
       const res = mockRes();
   
       const db = require('../config/db');
       db.mysqlConnection.query.mockImplementation((query, values, callback) => {
         callback(new Error('Database error'), null); // Simulating a database error
       });
   
       await getRODetailsByID(req, res);
   
       expect(res.status).toHaveBeenCalledWith(500);
       expect(res.json).toHaveBeenCalledWith({
         status: 'error',
         message: 'Database error',
         error: 'Database error',
       });
     });
   
     it('should return 400 if ro_id is missing in the request body', async () => {
       const req = mockReq({});
       const res = mockRes();
   
       await getRODetailsByID(req, res);
   
       expect(res.status).toHaveBeenCalledWith(400);
       expect(res.json).toHaveBeenCalledWith({
         status: 'error',
         message: 'ro_id is required.',
       });
     });
   });
   
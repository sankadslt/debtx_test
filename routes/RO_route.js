/* Purpose: This template is used for the RO Routes.
Created Date: 2024-12-03
Created By: Dinusha Anupama (dinushanupama@gmail.com)
Last Modified Date: 2024-12-08
Modified By: Dinusha Anupama (dinushanupama@gmail.com)
Version: Node.js v20.11.1
Dependencies: express
Related Files: RO_controller.js
Notes:  */

// import express from "express";
import { Router } from "express";
import { getRODetails, getRODetailsByID,Suspend_RO  } from "../controllers/RO_controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Recovery Officer
 *   description: API endpoints for managing recovery officers
 */


/**
 * @swagger
 * /api/recovery_officer/RO_Details:
 *   get:
 *     summary: RO-2G01 Retrieve Recovery Officer(s) (RO)
 *     description: |
 *       Retrieve all Recovery Officers related to Debt Recovery Companies, including their assigned RTOMs and areas.
 * 
 *       | Version | Date        | Description                                        | Change By        |
 *       |---------|-------------|--------------------------------------------------|------------------|
 *       | 01      | 2024-Dec-13 | Retrieve all Recovery Officers                   | Dinusha Anupama  |
 * 
 *     tags: [Recovery Officer]
 *     parameters:
 *       # No query or body parameters are required for this route
 *     responses:
 *       200:
 *         description: Recovery Officer(s) retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Recovery Officer(s) retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ro_id:
 *                         type: integer
 *                         example: 1
 *                       ro_name:
 *                         type: string
 *                         example: John Doe
 *                       ro_contact_no:
 *                         type: string
 *                         example: 1234567890
 *                       drc_id:
 *                         type: integer
 *                         example: 101
 *                       drc_name:
 *                         type: string
 *                         example: Debt Recovery Co. Ltd.
 *                       ro_status:
 *                         type: string
 *                         enum: [Active, Inactive]
 *                         example: Active
 *                       login_type:
 *                         type: string
 *                         example: Admin
 *                       login_user_id:
 *                         type: string
 *                         example: 112233
 *                       remark:
 *                         type: string
 *                         example: Remark about the officer.
 *                       assigned_rtoms:
 *                         type: array
 *                         description: List of assigned RTOMs with area names.
 *                         items:
 *                           type: object
 *                           properties:
 *                             rtom_id:
 *                               type: integer
 *                               example: 10
 *                             rtom_abbrivation:
 *                               type: string
 *                               example: RTOM-01
 *                             area_name:
 *                               type: string
 *                               example: Downtown Area
 *       404:
 *         description: No recovery officer(s) found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: No recovery officer(s) found.
 *       500:
 *         description: Database or internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 *                 error:
 *                   type: string
 *                   example: Database connection failed.
 */

router.get("/RO_Details", (req, res) => {
    console.log("Incoming request to /RO_Details:", req.query); // Debugging log
    getRODetails(req, res);
});

/**
 * @swagger
 * /api/recovery_officer/RO_Details_By_ID:
 *   post:
 *     summary: RO-2P02 Retrieve Recovery Officer by ID
 *     description: |
 *       Retrieve a Recovery Officer's details by the provided `ro_id`.
 * 
 *       | Version | Date        | Description               | Change By        |
 *       |---------|-------------|---------------------------|------------------|
 *       | 01      | 2024-Dec-06 | Retrieve Recovery Officer by ID | Dinusha Anupama |
 * 
 *     tags: [Recovery Officer]
 *     parameters:
 *       - in: query
 *         name: ro_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the Recovery Officer whose details are to be retrieved.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ro_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Recovery Officer details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Recovery Officer details retrieved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                       ro_id:
 *                         type: integer
 *                         example: 1
 *                       ro_name:
 *                         type: string
 *                         example: John Doe
 *                       ro_contact_no:
 *                         type: string
 *                         example: 1234567890
 *                       drc_id:
 *                         type: integer
 *                         example: 101
 *                       ro_status:
 *                         type: string
 *                         enum: [Active, Inactive]
 *                         example: Active
 *                       login_type:
 *                         type: string
 *                         example: Admin
 *                       login_user_id:
 *                         type: string
 *                         example: 112233
 *                       remark:
 *                         type: string
 *                         example: Remark about the officer.
 *       404:
 *         description: Recovery Officer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: No Recovery Officer found with the provided ID.
 *       500:
 *         description: Database or internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */


// Route to retrieve Recovery Officer details by ID
router.post("/RO_Details_By_ID", getRODetailsByID);



router.patch("/Suspend_RO", Suspend_RO);


export default router;
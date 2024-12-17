/*
    Purpose: This template is used for the DRC Routes.
    Created Date: 2024-11-21
    Created By: Lasandi Randini (randini-im20057@stu.kln.ac.lk)
    Version: Node.js v20.11.1
    Dependencies: express
    Related Files: DRC_controller.js
    Notes:  
*/

import { Router } from "express";
import {
   Service_to_DRC, Remove_Service_From_DRC
} from "../controllers/DRC_Service_controller.js";

const router = Router();



/**
 * @swagger
 * tags:
 *   - name: Debt Recovery Company-Services
 *     description: Services-related endpoints, allowing management and registration of services.
 *
 * /api/DRC_service/Service_to_DRC:
 *   post:
 *     summary: DS-2PO1 Create new record in debt_reocovery_compnay_service
 *     description: |
 *       Assigns a service to a DRC with a default status of "Active." Ensures no active service exists for the specified DRC before assignment:
 *       
 *       | Version | Date       | Description            |
 *       |---------|------------|------------------------|
 *       | 01      | 2024-Dec-07|                        |
 *       
 *     tags:
 *       - Debt Recovery Company-Services
 *     parameters:
 *       - in: query
 *         name: DRC_ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 101
 *         description: The unique identifier of the DRC to which the service will be assigned.
 *       - in: query
 *         name: Service_ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 202
 *         description: The unique identifier of the service to be assigned to the DRC.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DRC_ID:
 *                 type: integer
 *                 description: The ID of the DRC.
 *                 example: 101
 *               Service_ID:
 *                 type: integer
 *                 description: The ID of the service.
 *                 example: 202
 *     responses:
 *       201:
 *         description: Service assigned to DRC successfully.
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
 *                   example: Service assigned to DRC successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     drc_id:
 *                       type: integer
 *                       example: 101
 *                     service_id:
 *                       type: integer
 *                       example: 202
 *                     drc_service_status:
 *                       type: string
 *                       example: Active
 *                     created_by:
 *                       type: string
 *                       example: Admin
 *                     created_dtm:
 *                       type: string
 *                       example: 2024-12-07 12:00:00
 *                     service_status_changed_by:
 *                       type: string
 *                       example: Admin
 *                     service_status_changed_dtm:
 *                       type: string
 *                       example: 2024-12-07 12:00:00
 *       400:
 *         description: Validation error or active service already exists.
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
 *                   example: An active service already exists for this company.
 *       500:
 *         description: Internal server or database error occurred.
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
 *                   example: Failed to assign service to DRC.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: string
 *                       example: Failed to verify existing active services.
 */
router.post("/Service_to_DRC", Service_to_DRC);


/**
 * @swagger
 * tags:
 *   - name: Debt Recovery Company-Services
 *     description: Services-related endpoints, allowing management and registration of services.
 *
 * /api/DRC_service/Remove_Service_From_DRC:
 *   patch:
 *     summary: DS-2AO1 Remove Service From DRC
 *     description: |
 *       Deactivates an active service from a specific DRC by updating its status to "Inactive".
 *       
 *       | Version | Date       | Description |
 *       |---------|------------|-------------|
 *       | 01      | 2024-Dec-07|             |
 *       
 *     tags:
 *       - Debt Recovery Company-Services
 *     parameters:
 *       - in: query
 *         name: DRC_ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 101
 *         description: The unique ID of the DRC.
 *       - in: query
 *         name: Service_ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 202
 *         description: The unique ID of the service to be removed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DRC_ID:
 *                 type: integer
 *                 description: The unique ID of the DRC.
 *                 example: 101
 *               Service_ID:
 *                 type: integer
 *                 description: The unique ID of the service to be removed.
 *                 example: 202
 *     responses:
 *       200:
 *         description: Service removed successfully from the DRC.
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
 *                   example: Service removed successfully from DRC.
 *                 data:
 *                   type: object
 *                   properties:
 *                     DRC_ID:
 *                       type: integer
 *                       example: 101
 *                     Service_ID:
 *                       type: integer
 *                       example: 202
 *                     drc_service_status:
 *                       type: string
 *                       example: Inactive
 *       400:
 *         description: Validation error due to missing required fields.
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
 *                   example: Failed to remove service from DRC.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     field_name:
 *                       type: string
 *                       example: DRC_ID and Service_ID are required.
 *       404:
 *         description: No active service found for the specified DRC and Service ID.
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
 *                   example: No active service found for the specified DRC and Service ID.
 *       500:
 *         description: Internal server error or database error.
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
 *                   example: Failed to remove service from DRC.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: string
 *                       example: Database error message.
 */
router.patch("/Remove_Service_From_DRC", Remove_Service_From_DRC);

export default router;


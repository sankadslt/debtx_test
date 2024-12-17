/* 
    Purpose: This template is used for the DRC Routes.
    Created Date: 2024-12-12
    Created By: Sasindu Srinayaka (sasindusrinayaka@gmail.com)
    Last Modified Date: 
    Modified By: 
    Version: Node.js v20.11.1
    Dependencies: express
    Related Files: RTOM_controller.js, Rtom.js
    Notes:  
*/

// RTOM_route.mjs
import { Router } from "express";
import { 
    getRTOMDetails,
    getRTOMDetailsById,
} from '../controllers/RTOM_controller.js';

const router = Router();

/**
 * @swagger
 * /api/RTOM/RTOM_Details:
 *   get:
 *     summary: Retrieve details of all RTOMs.
 *     description: |
 *       List all RTOM details.
 *       
 *       | Version | Date       | Description |
 *       |---------|------------|-------------|
 *       | 01      | 2024-Dec-12|             |
 *     tags:
 *       - RTOM
 * 
 *     responses:
 *       200:
 *         description: RTOM details retrieved successfully.
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
 *                   example: RTOM details retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rtom_id:
 *                         type: integer
 *                         example: 1
 *                       rtom_abbrivation:
 *                         type: string
 *                         example: Sample RTOM Name
 *                       area_name:
 *                         type: string
 *                         example: Sample Area Name
 *                       rtom_status:
 *                         type: string
 *                         example: Active
 *
 *       500:
 *         description: Internal server error occurred while fetching RTOM details.
 */
router.get('/RTOM_Details', getRTOMDetails);

/**
 * @swagger
 * /api/RTOM/RTOM_Details_By_ID:
 *   post:
 *     summary: RTOM-1P02 Retrieve details of a specific RTOM by DRC_ID 
 *     description: |
 *       Obtain RTOM Details w.r.t. RTOM_ID:
 *       
 *       | Version | Date       | Description |
 *       |---------|------------|-------------|
 *       | 01      | 2024-Dec-07|             |
 *     tags:
 *       - RTOM
 *     parameters:
 *       - in: query
 *         name: RTOM_ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 101
 *         description: The ID of the DRC to be retieved.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               RTOM_ID:
 *                 type: integer
 *                 description: Unique ID of the RTOM.
 *                 example: 1
 *     responses:
 *       200:
 *         description: RTOM details retrieved successfully.
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
 *                   example: RTOM details retrieved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     rtom:
 *                       type: object
 *                       properties:
 *                         rtom_id:
 *                           type: integer
 *                           example: 1
 *                         rtom_abbreviation:
 *                           type: string
 *                           example: ABC
 *                         area_name:
 *                           type: string
 *                           example: Sample RTOM Name
 *                         rtom_status:
 *                           type: string
 *                           example: Active
 *       400:
 *         description: Invalid or missing RTOM ID.
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
 *                   example: Failed to retrieve RTOM details.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 404
 *                     description:
 *                       type: string
 *                       example: RTOM with the given ID not found.
 *       500:
 *         description: Internal server error occurred while fetching RTOM details.
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
 *                   example: An unexpected error occurred.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 500
 *                     description:
 *                       type: string
 *                       example: Internal server error occurred while fetching RTOM details.
 */
router.post("/RTOM_Details_By_ID", getRTOMDetailsById);

export default router;

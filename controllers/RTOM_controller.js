/* Purpose: This template is used for the RTOM Controllers.
Created Date: 2024-12-03 
Created By: Sasindu Srinayaka (sasindusrinayaka@gmail.com)
Last Modified Date: 2024-11-24
Modified By: Sasindu Srinayaka (sasindusrinayaka@gmail.com)
Version: Node.js v20.11.1
Dependencies: mysql2
Related Files: RTOM_route.js and Rtom.js
Notes:  */

import db from "../config/db.js"; // Import the database connection

export const getRTOMDetails = async (req, res) => {
  try {
    const query = `
      SELECT * FROM rtom
    `;

    const result = await connection.query(query);

    return res.status(200).json({
      status: 'success',
      message: 'All RTOM details retrieved successfully.',
      data: result,
    });
  } catch (error) {
    console.error('An error occurred while fetching RTOM data', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve RTOM details.',
      errors: {
        code: 500,
        description: 'Internal server error occurred while fetching RTOM details.',
      },
    });
  } finally {
    if (connection) connection.release();
  }
};


export const getRTOMDetailsById = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { rtom_id } = req.body;

    if (!rtom_id) {
      return res.status(400).json({
        status: "error",
        message: "Failed to retrieve RTOM details.",
        errors: {
          code: 400,
          description: "RTOM ID is required.",
        },
      });
    }

    const query = `
      SELECT * FROM rtom
      WHERE rtom_id = ?
    `;

    db.mysqlConnection.query(query, [rtom_id], (err, result) => {
      if (err) {
        console.error("An error occurred while fetching RTOM data", err);
        return res.status(500).json({
          status: "error",
          message: "Failed to retrieve RTOM details.",
          errors: {
            code: 500,
            description: "Internal server error occurred while fetching RTOM details.",
          },
        });
      }

      return res.status(200).json({
        status: "success",
        message: "All RTOM details retrieved successfully.",
        data: result,
      });
    });
  } catch (err) {
    console.error("An error occurred while fetching RTOM data", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve RTOM details.",
      errors: {
        code: 500,
        description: "Internal server error occurred while fetching RTOM details.",
      },
    });
  }
};

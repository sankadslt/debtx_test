/* 
    Purpose: This template is used for the DRC Controllers.
    Created Date: 2024-11-21
    Created By: Lasandi Randini (randini-im20057@stu.kln.ac.lk)
    Version: Node.js v20.11.1
    Dependencies: mysql2
    Related Files: DRC_route.js
    Notes:  
*/


import db from "../config/db.js"; 



// Function to assign a service to a DRC
export const Service_to_DRC = (req, res) => {
  const { DRC_ID, Service_ID } = req.body;

  try {
    // Validate required fields
    if (!DRC_ID || !Service_ID) {
      return res.status(400).json({
        status: "error",
        message: "Both DRC_ID and Service_ID are required.",
      });
    }

    // Query to check if the service exists for the DRC
    const checkQuery = `
      SELECT * FROM company_owned_services 
      WHERE drc_id = ? AND service_id = ?;
    `;

    db.mysqlConnection.query(checkQuery, [DRC_ID, Service_ID], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error checking service existence:", checkErr);
        return res.status(500).json({
          status: "error",
          message: "Failed to verify existing services.",
          errors: { database: checkErr.message },
        });
      }

      if (checkResult.length > 0) {
        const existingService = checkResult[0];

        if (existingService.drc_service_status === "Active") {
          // Active service already exists
          return res.status(400).json({
            status: "error",
            message: "An active service already exists for this company.",
          });
        } else {
          // Service exists but is inactive, update to active
          const updateQuery = `
            UPDATE company_owned_services
            SET drc_service_status = 'Active',
                service_status_changed_by = 'Admin',
                service_status_changed_dtm = CURRENT_TIMESTAMP
            WHERE id = ?;
          `;

          db.mysqlConnection.query(updateQuery, [existingService.id], (updateErr) => {
            if (updateErr) {
              console.error("Error updating service status:", updateErr);
              return res.status(500).json({
                status: "error",
                message: "Failed to update service status.",
                errors: { database: updateErr.message },
              });
            }

            return res.status(200).json({
              status: "success",
              message: "Service status updated to active.",
            });
          });

          return;
        }
      }

      // No service found, insert a new record
      const insertQuery = `
        INSERT INTO company_owned_services (
          drc_id,
          service_id,
          drc_service_status,
          created_by,
          created_dtm,
          service_status_changed_by,
          service_status_changed_dtm
        ) VALUES (?, ?, 'Active', 'Admin', CURRENT_TIMESTAMP, 'Admin', CURRENT_TIMESTAMP);
      `;

      db.mysqlConnection.query(insertQuery, [DRC_ID, Service_ID], (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Error inserting service for DRC:", insertErr);
          return res.status(500).json({
            status: "error",
            message: "Failed to assign service to DRC.",
            errors: { database: insertErr.message },
          });
        }

        return res.status(201).json({
          status: "success",
          message: "Service assigned to DRC successfully.",
          data: {
            id: insertResult.insertId,
            drc_id: DRC_ID,
            service_id: Service_ID,
            drc_service_status: "Active",
          },
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error during Service_to_DRC:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to assign service to DRC.",
      errors: { exception: error.message },
    });
  }
};





  // Function to remove a service from a DRC
export const Remove_Service_From_DRC = (req, res) => {
  const { DRC_ID, Service_ID } = req.body;

  try {
    // Validate required fields
    if (!DRC_ID || !Service_ID) {
      return res.status(400).json({
        status: "error",
        message: "Failed to remove service from DRC.",
        errors: {
          field_name: "DRC_ID and Service_ID are required",
        },
      });
    }

    // SQL Query to check if the service exists and is currently active for the given DRC
    const checkQuery = `
      SELECT drc_service_status
      FROM company_owned_services
      WHERE drc_id = ? AND service_id = ? AND drc_service_status = 'Active'
    `;

    db.mysqlConnection.query(checkQuery, [DRC_ID, Service_ID], (err, result) => {
      if (err) {
        console.error("Error checking service status:", err);
        return res.status(500).json({
          status: "error",
          message: "Failed to remove service from DRC.",
          errors: { database: err.message },
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No active service found for the specified DRC and Service ID.",
        });
      }

      // If the service is active, update its status to 'Inactive'
      const updateQuery = `
        UPDATE company_owned_services
        SET drc_service_status = 'Inactive',
            service_status_changed_by = 'Admin', -- Replace with logged-in user if applicable
            service_status_changed_dtm = CURRENT_TIMESTAMP
        WHERE drc_id = ? AND service_id = ?
      `;

      db.mysqlConnection.query(updateQuery, [DRC_ID, Service_ID], (err, updateResult) => {
        if (err) {
          console.error("Error updating service status:", err);
          return res.status(500).json({
            status: "error",
            message: "Failed to update service status.",
            errors: { database: err.message },
          });
        }

        if (updateResult.affectedRows === 0) {
          return res.status(404).json({
            status: "error",
            message: "No matching service found to update.",
          });
        }

        // Return success response
        return res.status(200).json({
          status: "success",
          message: "Service removed successfully from DRC.",
          data: {
            DRC_ID,
            Service_ID,
            drc_service_status: "Inactive",
          },
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error during service removal:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to remove service from DRC.",
      errors: { exception: error.message },
    });
  }
};
  
  
  
  
  
  
  
  
  
  

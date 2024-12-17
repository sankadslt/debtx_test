/* Purpose: This template is used for the RO Controller.
Created Date: 2024-12-04
Created By: Dinusha Anupama (dinushanupama@gmail.com)
Last Modified Date: 2024-12-13
Modified By: Dinusha Anupama (dinushanupama@gmail.com)
           : Ravindu Pathum (ravindupathumiit@gmail.com)
Version: Node.js v20.11.1
Dependencies: mysql2
Related Files: RO_route.js
Notes:  */

import db from "../config/db.js";
import RecoveryOfficer from "../models/Recovery_officer.js";

// Retrieve Recovery Officers
// export const getRODetails =  (req, res) => {
//   try {
//     // SQL query to get recovery officer details along with DRC name and assigned RTOMs
//     const query = `
//       SELECT 
//         ro.ro_id,
//         ro.ro_name,
//         ro.ro_contact_no,
//         ro.drc_id,
//         drc.drc_name,
//         ro.ro_status,
//         ro.login_type,
//         ro.login_user_id,
//         ro.remark,
//         GROUP_CONCAT(
//           CONCAT(
//             '{"rtom_id":', rtom.rtom_id, 
//             ',"area_name":"', rtom.area_name, '"}'
//           )
//         ) AS rtoms_for_ro
//       FROM 
//         recovery_officer ro
//       LEFT JOIN 
//         debt_recovery_company drc ON ro.drc_id = drc.drc_id
//       LEFT JOIN 
//         recovery_officer_rtoms rort ON ro.ro_id = rort.ro_id
//       LEFT JOIN 
//         rtom ON rort.rtom_id = rtom.rtom_id
//       GROUP BY 
//         ro.ro_id
//     `;

//     // Execute the query
//     db.mysqlConnection.query(query, (err, results) => {
//       if (err) {
//         console.error("Error retrieving Recovery Officers:", err.message);
//         return res.status(500).json({
//           status: "error",
//           message: "Database error",
//           error: err.message,
//         });
//       }

//       // Check if any data is found
//       if (results.length === 0) {
//         return res.status(404).json({
//           status: "error",
//           message: "No Recovery Officer(s) found.",
//         });
//       }

//       // Format the results
//       const formattedResults = results.map((row) => ({
//         ro_id: row.ro_id,
//         ro_name: row.ro_name,
//         ro_contact_no: row.ro_contact_no,
//         drc_id: row.drc_id,
//         drc_name: row.drc_name,
//         ro_status: row.ro_status,
//         login_type: row.login_type,
//         login_user_id: row.login_user_id,
//         remark: row.remark,
//         rtoms_for_ro: row.rtoms_for_ro
//           ? JSON.parse(`[${row.rtoms_for_ro}]`).flat()  // Flatten the array after parsing
//           : [],
//       }));

//       // Return the formatted data
//       return res.status(200).json({
//         status: "success",
//         message: "Recovery Officer(s) retrieved successfully.",
//         data: formattedResults,
//       });
//     });
//   } catch (error) {
//     console.error("Unexpected error:", error.message);
//     return res.status(500).json({
//       status: "error",
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// Retrieve Recovery Officers
export const getRODetails = (req, res) => {
  try {
    // SQL query to get recovery officer details along with DRC name and assigned RTOMs
    const query = `
      SELECT 
        ro.ro_id,
        ro.ro_name,
        ro.ro_contact_no,
        ro.drc_id,
        drc.drc_name,
        ro.ro_status,
        ro.login_type,
        ro.login_user_id,
        ro.remark,
        GROUP_CONCAT(
          CONCAT(
            '{"rtom_id":', rtom.rtom_id, 
            ',"area_name":"', rtom.area_name, '"}'
          )
        ) AS rtoms_for_ro
      FROM 
        recovery_officer ro
      LEFT JOIN 
        debt_recovery_company drc ON ro.drc_id = drc.drc_id
      LEFT JOIN 
        recovery_officer_rtoms rort ON ro.ro_id = rort.ro_id
      LEFT JOIN 
        rtom ON rort.rtom_id = rtom.rtom_id
      GROUP BY 
        ro.ro_id
    `;

    // Execute the query
    db.mysqlConnection.query(query, async (err, results) => {
      if (err) {
        console.error("Error retrieving Recovery Officers:", err.message);
        return res.status(500).json({
          status: "error",
          message: "Database error",
          error: err.message,
        });
      }

      // Fetch data from MongoDB
      const mongoData = await RecoveryOfficer.find({}, { drc_id: 0 });  // Fetching without 'drc_id'

      // Check if any data is found
      if (results.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No Recovery Officer(s) found.",
        });
      }

      // Format the results
      const formattedResults = results.map((row) => {
        // const mongoRO = mongoData.find((mongoRow) => mongoRow.ro_id === row.ro_id); // Match by ro_id
        return {
          ro_id: row.ro_id,
          ro_name: row.ro_name,
          ro_contact_no: row.ro_contact_no,
          drc_id: row.drc_id,
          drc_name: row.drc_name,
          ro_status: row.ro_status,
          login_type: row.login_type,
          login_user_id: row.login_user_id,
          remark: row.remark,
          rtoms_for_ro: row.rtoms_for_ro
            ? JSON.parse(`[${row.rtoms_for_ro}]`).flat()  // Flatten the array after parsing
            : [],
          // Merge MongoDB data into the response (without drc_id)
          // mongo_data: mongoRO ? mongoRO : null, // Add MongoDB data (without drc_id)
        };
      });

      // Return the formatted data
      return res.status(200).json({
        status: "success",
        message: "Recovery Officer(s) retrieved successfully.",
        data: formattedResults,
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};



// Retrieve Recovery Officer by ID
export const getRODetailsByID = (req, res) => {
    try {
      // Extract ro_id from the request body
      const { ro_id } = req.body;
  
      // Validate if ro_id is provided
      if (!ro_id) {
        return res.status(400).json({
          status: "error",
          message: "ro_id is required.",
        });
      }
  
      // SQL query to get recovery officer details by ID
      const query = `
        SELECT ro_id, ro_name, ro_contact_no, drc_id, ro_status, login_type, login_user_id, remark
        FROM recovery_officer
        WHERE ro_id = ?
      `;
  
      // Execute the query with the provided ro_id
      db.mysqlConnection.query(query, [ro_id], (err, results) => {
        if (err) {
          console.error("Error retrieving Recovery Officer:", err.message);
          return res.status(500).json({
            status: "error",
            message: "Database error",
            error: err.message,
          });
        }
  
        // Check if a recovery officer is found
        if (results.length === 0) {
          return res.status(404).json({
            status: "error",
            message: `No Recovery Officer found with ro_id: ${ro_id}.`,
          });
        }
  
        // Return the retrieved recovery officer data
        return res.status(200).json({
          status: "success",
          message: "Recovery Officer retrieved successfully.",
          data: results[0],
        });
      });
    } catch (error) {
      console.error("Unexpected error:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  
// Update Recovery Officer Status by ID
export const Suspend_RO = async (req, res) => {
  const { ro_id, ro_status } = req.body;

  if (!ro_id || !ro_status) {
    return res.status(400).json({
      status: "error",
      message: "All field should required",
    });
  }

  const updateStatusQue = `UPDATE recovery_officer SET ro_status = ? WHERE ro_id = ?`;

  db.mysqlConnection.query(updateStatusQue, [ro_status,ro_id], (err,results) =>{
    if (err) {
      console.error("Error updating status:", err.message);
      return res.status(500).json({
        status: "error",
        message: "Database updating error",
        error: err.message,
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Recovery Officer status update successfully.",
      data: results[0],
    });
  });
  const filter = { ro_id: ro_id };
  const update = { ro_status: ro_status };

  try{
    await db.connectMongoDB();
    const updatedResult = await RecoveryOfficer.updateOne(filter, {$set: update});
    if (updatedResult.matchedCount === 0) {
      console.log("Recovery Officer not found :", updatedResult);
    }
  }catch (err) {
    console.error("Error updating MongoDB:", err.message);
  }
}
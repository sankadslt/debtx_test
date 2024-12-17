/* 
    Purpose: This template is used for the DRC Controllers.
    Created Date: 2024-11-21
    Created By: Janendra Chamodi (apjanendra@gmail.com)
    Last Modified Date: 2024-11-24
    Modified By: Janendra Chamodi (apjanendra@gmail.com)
                Naduni Rabel (rabelnaduni2000@gmail.com)
                Lasandi Randini (randini-im20057@stu.kln.ac.lk)
    Version: Node.js v20.11.1
    Dependencies: mysql2
    Related Files: DRC_route.js
    Notes:  
*/




import db from "../config/db.js";
import DRC from "../models/Debt_recovery_company.js";

// Function to register a new Debt Recovery Company (DRC)
export const registerDRC = async (req, res) => {
  const { DRC_Name, DRC_Abbreviation, Contact_Number } = req.body;

  try {
    // Validate required fields
    if (!DRC_Name || !DRC_Abbreviation || !Contact_Number) {
      return res.status(400).json({
        status: "error",
        message: "Failed to register DRC.",
        errors: {
          field_name: "All fields are required",
        },
      });
    }

    // Default values
    const drcStatus = "Active"; // Default to Active status
    const drcEndDate = ""; // Default end date is null
    const createdBy = "Admin"; // Default creator
    const create_dtm = new Date(); // Current date and time

    // Connect to MongoDB
    const mongoConnection = await db.connectMongoDB();
    if (!mongoConnection) {
      throw new Error("MongoDB connection failed");
    }

    const counterResult = await mongoConnection.collection("counters").findOneAndUpdate(
    { _id: "drc_id" },
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true }
);

console.log("Counter Result:", counterResult);

// Correctly extract the sequence ID from the top-level structure
if (!counterResult || !counterResult.seq) {
  throw new Error("Failed to generate drc_id");
}


    const drc_id = counterResult.seq;

    // Save data to MongoDB
    const newDRC = new DRC({
      drc_id,
      drc_abbreviation: DRC_Abbreviation,
      drc_name: DRC_Name,
      drc_status: drcStatus,
      teli_no: Contact_Number,
      drc_end_dat: drcEndDate,
      create_by: createdBy,
      create_dtm,
      services_of_drc: [], // Initialize with an empty array of services
    });

    await newDRC.save();

    // Save data to MySQL
    const insertDRCQuery = `
      INSERT INTO debt_recovery_company (
        drc_id,
        drc_name,
        drc_abbreviation,
        contact_number,
        drc_status,
        drc_end_dat,
        create_by,
        create_dtm
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valuesForQuery = [
      drc_id,
      DRC_Name,
      DRC_Abbreviation,
      Contact_Number,
      drcStatus,
      drcEndDate,
      createdBy,
      create_dtm,
    ];

    await new Promise((resolve, reject) => {
      db.mysqlConnection.query(insertDRCQuery, valuesForQuery, (err, result) => {
        if (err) {
          console.error("Error inserting DRC into MySQL:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Return success response
    res.status(201).json({
      status: "success",
      message: "DRC registered successfully.",
      data: {
        drc_id,
        drc_abbreviation: DRC_Abbreviation,
        drc_name: DRC_Name,
        contact_no: Contact_Number,
        drc_status: drcStatus,
        drc_end_date: drcEndDate,
        created_by: createdBy,
        created_dtm: create_dtm,
      },
    });
  } catch (error) {
    console.error("Unexpected error during DRC registration:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to register DRC.",
      errors: {
        exception: error.message,
      },
    });
  }
};


export const updateDRCStatus = async (req, res) => {
  const { drc_id, drc_status } = req.body;

  try {
    // Validate input
    if (!drc_id || typeof drc_status === 'undefined') {
      return res.status(400).json({
        status: "error",
        message: "Failed to update DRC status.",
        errors: {
          code: 400,
          description: "DRC ID and status are required.",
        },
      });
    }

    // SQL query to update DRC status in MySQL
    const updateStatusInMySQL = () =>
      new Promise((resolve, reject) => {
        const query = `
          UPDATE debt_recovery_company
          SET drc_status = ?
          WHERE drc_id = ?
        `;
        db.mysqlConnection.query(query, [drc_status, drc_id], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

    const mysqlResult = await updateStatusInMySQL();

    // Check if MySQL update affected any rows
    if (mysqlResult.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Failed to update DRC status.",
        errors: {
          code: 404,
          description: "No record found with the provided DRC ID.",
        },
      });
    }

    // Update the DRC status in MongoDB
    const updateStatusInMongoDB = await DRC.findOneAndUpdate(
      { drc_id },
      { drc_status },
      { new: true }
    );

    // Check if MongoDB update found the record
    if (!updateStatusInMongoDB) {
      return res.status(404).json({
        status: "error",
        message: "Failed to update DRC status in MongoDB.",
        errors: {
          code: 404,
          description: "No DRC found in MongoDB for the given drc_id.",
        },
      });
    }

    // Return success response
    return res.status(200).json({
      status: "success",
      message: "DRC status updated successfully.",
      data: {
        drc_id,
        drc_status,
      },
    });

  } catch (err) {
    console.error("Error occurred while updating DRC status:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to update DRC status.",
      errors: {
        code: 500,
        description: "An unexpected error occurred. Please try again later.",
      },
    });
  }
};

export const getDRCDetails = async (req, res) => {
  let connection; 
  try {
    const query = `
      SELECT * FROM debt_recovery_company
    `;

    connection = await db.pool.getConnection();
    const result = await connection.query(query);

    return res.status(200).json({
      status: 'success',
      message: 'All DRC details retrieved successfully.',
      data: result,
    });
  } catch (error) {
    console.error('An error occurred while fetching DRC data', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve DRC details.',
      errors: {
        code: 500,
        description: 'Internal server error occurred while fetching DRC details.',
      },
    });
  } finally {
    if (connection) connection.release();
  }
};

export const getDRCDetailsById = async(req, res) => {
  const { DRC_ID } = req.body;

  try {
    // Validating
    if (!DRC_ID) {
      return res.status(400).json({
        status: "error",
        message: "Failed to retrieve DRC details.",
        errors: {
          code: 400,
          description: "DRC ID is required.",
        },
      });
    }

    const query = `
      SELECT * FROM debt_recovery_company
      WHERE drc_id = ?
    `;

    db.mysqlConnection.query(
        query,
        [DRC_ID],
        (err, result) => {
          if (err) {
            console.error("An error occured while fetching DRC data", err);
            return res.status(500)
                      .json({ 
                        status:"error",
                        message: "Failed to retrieve DRC details.", 
                        errors:{
                          "code":500,
                          "description":"Internal server error occured while fetching DRC details."
                        } 
                      });
          }
          // Return success response with retireved data
          return res.status(200)
          .json(
            {status:'success', 
             message:'All DRC details retrieved successfully.', 
             data:result
            }
          );
        }
      );

  } catch (err) { 
    console.error("An error occured while fetching DRC data", err);
    return res.status(500)
              .json({ 
                status:"error",
                message: "Failed to retrieve DRC details.", 
                errors:{
                  "code":500,
                  "description":"Internal server error occured while fetching DRC details."
                } 
    });
  }
};
export const getActiveDRCDetails= async(req, res) => {

  try {

    // SQL Query to feth data
    const query = `
      SELECT * FROM debt_recovery_company 
      WHERE drc_status = 'Active'
    `;

    // Execute the query
    db.mysqlConnection.query(
      query,
      (err, result) => {
        if (err) {
          console.error("An error occured while fetching DRC data", err);
          return res.status(500)
                    .json({ 
                      status:"error",
                      message: "Failed to retrieve DRC details.", 
                      errors:{
                        "code":500,
                        "description":"Internal server error occured while fetching DRC details."
                      } 
                    });
        }
        // Return success response with retireved data
        return res.status(200)
        .json(
          {status:'success', 
           message:'All DRC details retrieved successfully.', 
           data:result}
        );
      }
    );
  } catch (error) {
    console.error("An error occured while fetching DRC data", err);
          return res.status(500)
                    .json({ 
                      status:"error",
                      message: "Failed to retrieve DRC details.", 
                      errors:{
                        "code":500,
                        "description":"Internal server error occured while fetching active DRC details."
                      } 
          });
  }

};


 //retrieve DRC details with service details by drc_id
/*tables involved: debt_recovery_company
                   debt_recovery_company_service
                   service_type*/


export const getDRCWithServicesByDRCId = async(req, res) => {
  try{

    const  {DRC_ID} = req.body;

    if(!DRC_ID){


      return res.status(404)
      .json({ 
        status:"error",
        message: "Failed to retrieve DRC details.", 
        errors:{
          "code":404,
          "description":"DRC with the given ID not found"
        } 
      });
    }
    //SQL query to fetch data. Services details are returned as a string that resembles a JSON array.
    const query = `
    SELECT drc.*, 
           CONCAT(
           '[',
            GROUP_CONCAT(
                '{"id":', drc_s.id,
                  ',"service_id":', st.service_id,
                  ',"service_type":"', st.service_type, '"',
                  ',"service_status":"', st.service_status, '"}' 
              SEPARATOR ','
            ),
           ']'
          )  AS services            
    FROM debt_recovery_company drc

    JOIN company_owned_services drc_s ON drc.drc_id = drc_s.drc_id
    JOIN service_type st ON drc_s.service_id = st.service_id
    WHERE drc.drc_id = ?
    GROUP BY drc.drc_id;
    
  `;

  //execute the query
  db.mysqlConnection.query(
    query,
    [DRC_ID],
    (err, result) => {
      if (err) {
        console.error("An error occured while fetching DRC data", err);
        return res.status(500)
                  .json({ 
                    status:"error",
                    message: "An unexpected error occured.", 
                    errors:{
                      "code":500,
                      "description":"Internal server error occured while fetching DRC details."

                    } 
                  });
      }

      //format data for the response
      const final_result_array = result.map(data => ({
        drc: {
          drc_id: data.drc_id,
          abbreviation: data.abbreviation,
          drc_name: data.drc_name,
          drc_status: data.drc_status,
          teli_no: data.teli_no,
          drc_end_date: data.drc_end_date,
          create_by: data.create_by,
          create_dtm: data.creat_dtm
        },
        //parse the services string into a JavaScript object
        services: JSON.parse(data.services)
      }));

      //send only the record instead of an array
      const final_result = final_result_array.length===1 ? final_result_array[0]: final_result_array
     
      return res.status(200).json({status:'success', message:'DRC details retrieved successfully.', data:final_result});
    }
  ); 
  }catch(error){

    return res.status(500)

    .json({ 
      status:"error",
      message: "Failed to retrieve DRC details.", 
      errors:{

        "code":500,
        "description":"Internal server error occured while fetching DRC details."

      } 
    });
  } 
};  
  
 //retrieve DRC details with service details
/*tables involved: debt_recovery_company
                   debt_recovery_company_service
                   service_type*/


export const getDRCWithServices = async (req, res) => {
  try {
    // SQL query to fetch data. Services details are returned as a string that resembles a JSON array.
    const query = `
    SELECT drc.*, 
           CONCAT(
           '[',
            GROUP_CONCAT(
                '{"id":', drc_s.id,
                  ',"service_id":', st.service_id,
                  ',"service_type":"', st.service_type, '"', 
                  ',"service_status":"', st.service_status, '"}' 
              SEPARATOR ','
            ),
           ']'
          )  AS services            
    FROM debt_recovery_company drc

    LEFT JOIN company_owned_services drc_s ON drc.drc_id = drc_s.drc_id

    LEFT JOIN service_type st ON drc_s.service_id = st.service_id
    GROUP BY drc.drc_id;
  `;

    // Execute the query using the connection pool
    const connection = await db.pool.getConnection();

    try {
      const result = await connection.query(query);

      // Format data for the response
      const final_result = result.map(data => ({
        drc: {
                    drc_id: data.drc_id,
                    abbreviation: data.drc_abbreviation,
                    drc_name: data.drc_name,
                    drc_status: data.drc_status,
                    teli_no: data.contact_number,
                    drc_end_date: data.drc_end_date,
                    create_by: data.create_by,
                    create_dtm: data.creat_dtm
                  },
        services: JSON.parse(data.services)
      }));

      return res.status(200).json({
        status: 'success', 
        message: 'All DRC details retrieved successfully.', 
        data: final_result
      });
    } catch (err) {
      console.error("An error occurred while fetching DRC data", err);
      return res.status(500).json({
        status: "error",
        message: "Failed to retrieve DRC details.",
        errors: {
          "code": 500,
          "description": "Internal server error occurred while fetching DRC details."
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    return res.status(500)
      .json({ 
        status: "error",
        message: "Failed to retrieve DRC details.", 
        errors: {
          "code": 500,
          "description": "Internal server error occurred while fetching DRC details."
        } 
      });
  } 
};



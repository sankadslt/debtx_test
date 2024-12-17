
/* 
    Purpose: This template is used for the DRC Controllers.
    Created Date: 2024-11-21
    Created By: Janendra Chamodi (apjanendra@gmail.com)
    Last Modified Date: 2024-11-21
    Modified By: Janendra Chamodi (apjanendra@gmail.com)
                Naduni Rabel (rabelnaduni2000@gmail.com)
                Lasandi Randini (randini-im20057@stu.kln.ac.lk)
                Ravindu Pathum  (ravindupathumiit@gmail.com)
    Version: Node.js v20.11.1
    Dependencies: axios , mariadb , mongoose
    Related Files: DRC_route.js
    Notes:  
*/






import db from "../config/db.js";
import Service from "../models/Service.js";

export const registerServiceType = (req, res) => {
    try {
      const { service_type } = req.body;
  
      // Validate input
      if (!service_type) {
        return res.status(400).json({ message: "Service type is required." });
      }
  
      // SQL query to insert a new service type
      const query = `
        INSERT INTO service_type (service_type, service_status)
        VALUES (?, 'Active')
      `;
  
      // Execute the query
      db.mysqlConnection.query(query, [service_type], (err, result) => {
        if (err) {
          console.error("Error registering service type:", err);
          return res.status(500).json({ message: "Database error", error: err });
        }
  
        // Return success response
        const response = {
          status: "success",
          message: "Service type registered successfully.",
          data: {
            service_id: result.insertId,
            service_type: service_type,
            service_status: "Active",
          },
        };
  
        return res.status(201).json(response);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  };

  // export const changeServiceStatus = async (req, res) => {
  //   try {
  //     const { service_id, service_status } = req.body; //query parameters body parameters
  
  //     // Validate input
  //     if (!service_id || !service_status) {
  //       return res.status(400).json({
  //         status: "error",
  //         message: "Failed to update the service status.",
  //         errors: {
  //           code: 400,
  //           description: "Missing required fields: service_id or service_status.",
  //         },
  //       });
  //     }
  
      
  //     const query = `
  //       UPDATE service_type
  //       SET service_status = ?
  //       WHERE service_id = ?
  //     `;
  
      
  //     const updateServiceStatus = () =>
  //       new Promise((resolve, reject) => {
  //         db.mysqlConnection.query(
  //           query,
  //           [service_status, service_id],
  //           (err, result) => {
  //             if (err) return reject(err);
  //             resolve(result);
  //           }
  //         );
  //       });
  
  //     const result = await updateServiceStatus();
  
     
  //     if (result.affectedRows === 0) {
  //       return res.status(404).json({
  //         status: "error",
  //         message: "Failed to update the service status.",
  //         errors: {
  //           code: 404,
  //           description: "Service not found for the given service_id.",
  //         },
  //       });
  //     }
  
      
  //     const getServiceDetails = () =>
  //       new Promise((resolve, reject) => {
  //         db.mysqlConnection.query(
  //           "SELECT service_id, service_type, service_status FROM service_type WHERE service_id = ?",
  //           [service_id],
  //           (err, rows) => {
  //             if (err) return reject(err);
  //             resolve(rows[0]);
  //           }
  //         );
  //       });
  
  //     const updatedService = await getServiceDetails();
  
     
  //     return res.status(200).json({
  //       status: "success",
  //       message: "Service status updated successfully.",
  //       data: updatedService,
  //     });
  //   } catch (err) {
  //     console.error("Error updating service status:", err);
  //     return res.status(500).json({
  //       status: "error",
  //       message: "Failed to update the service status.",
  //       errors: {
  //         code: 500,
  //         description: "An unexpected error occurred while updating the service status.",
  //       },
  //     });
  //   }
  // };

  
  export const changeServiceStatus = async (req, res) => {
    try {
      const { service_id, service_status } = req.body;
  
      // Validate input
      if (!service_id || !service_status) {
        return res.status(400).json({
          status: "error",
          message: "Failed to update the service status.",
          errors: {
            code: 400,
            description: "Missing required fields: service_id or service_status.",
          },
        });
      }
  
      // SQL query to update service status in MySQL
      const query = `
        UPDATE service_type
        SET service_status = ?
        WHERE service_id = ?
      `;
  
      const updateServiceStatusInMySQL = () =>
        new Promise((resolve, reject) => {
          db.mysqlConnection.query(
            query,
            [service_status, service_id],
            (err, result) => {
              if (err) return reject(err);
              resolve(result);
            }
          );
        });
  
      const result = await updateServiceStatusInMySQL();
  
      // Check if MySQL update affected any rows
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: "error",
          message: "Failed to update the service status.",
          errors: {
            code: 404,
            description: "Service not found for the given service_id.",
          },
        });
      }
  
      // Update the service status in MongoDB
      const updateServiceStatusInMongoDB = await Service.findOneAndUpdate(
        { service_id },
        { service_status },
        { new: true }
      );
  
      // If MongoDB update fails to find the record
      if (!updateServiceStatusInMongoDB) {
        return res.status(404).json({
          status: "error",
          message: "Failed to update the service status in MongoDB.",
          errors: {
            code: 404,
            description: "Service not found in MongoDB for the given service_id.",
          },
        });
      }
  
      // Fetch updated details from MySQL for response
      const getServiceDetails = () =>
        new Promise((resolve, reject) => {
          db.mysqlConnection.query(
            "SELECT service_id, service_type, service_status FROM service_type WHERE service_id = ?",
            [service_id],
            (err, rows) => {
              if (err) return reject(err);
              resolve(rows[0]);
            }
          );
        });
  
      const updatedService = await getServiceDetails();
  
      // Return success response
      return res.status(200).json({
        status: "success",
        message: "Service status updated successfully in both MySQL and MongoDB.",
        data: updatedService,
      });
    } catch (err) {
      console.error("Error updating service status:", err);
      return res.status(500).json({
        status: "error",
        message: "Failed to update the service status.",
        errors: {
          code: 500,
          description: "An unexpected error occurred while updating the service status.",
        },
      });
    }
  };
  
  export const getAllServices = async (req, res) => {
    let mysqlData = null;
    let mongoData = null;
  
    try {
      //data from MySQL
      mysqlData = await new Promise((resolve, reject) => {
        const query = `SELECT * FROM service_type`;
        db.mysqlConnection.query(query, (err, result) => {
          if (err) {
            return reject(new Error("Error retrieving service data from MySQL"));
          }
          resolve(result);
        });
      });
    } catch (error) {
      console.error("MySQL fetch error:", error.message);
    }
  
    try {
      //  data from MongoDB
      mongoData = await Service.find({}).select('-__v'); 
    } catch (error) {
      console.error("MongoDB fetch error:", error.message);
    }
  
    // Handle case where neither MySQL nor MongoDB returned data
    if (!mysqlData && !mongoData) {
      return res.status(500).json({
        status: "error",
        message: "Failed to retrieve service details.",
        errors: {
          code: 500,
          description: "Internal server error occurred while fetching service details.",
        },
      });
    }
  
    // Combine and return data
    return res.status(200).json({
      status: "success",
      message: "Service details retrieved successfully.",
      data: {
        mysql: mysqlData,
        mongo: mongoData,
      },
    });
  };
  
    export const getServiceDetailsById = async (req, res) => {
      const { service_id } = req.body;
    
      // Check if service_id is provided
      if (!service_id) {
        return res.status(400).json({
          status: "error",
          message: "Failed to retrieve service details.",
          errors: {
            code: 400,
            description: "Service ID is required.",
          },
        });
      }
    
      let mysqlData = null;
      let mongoData = null;
    
      try {
        //  data from MySQL
        mysqlData = await new Promise((resolve, reject) => {
          const query = `SELECT * FROM service_type WHERE service_id = ?`;
          db.mysqlConnection.query(query, [service_id], (err, result) => {
            if (err) {
              return reject(new Error("Error retrieving service details from MySQL"));
            }
            resolve(result);
          });
        });
      } catch (error) {
        console.error("MySQL fetch error:", error.message);
      }
    
      try {
        //  data from MongoDB
        mongoData = await Service.findOne({ service_id });
      } catch (error) {
        console.error("MongoDB fetch error:", error.message);
      }
    
      // Handle case where neither MySQL nor MongoDB returned data
      if (!mysqlData && !mongoData || (mysqlData && mysqlData.length === 0 && !mongoData)) {
        return res.status(404).json({
          status: "error",
          message: "Service not found.",
          errors: {
            code: 404,
            description: `No service found with service_id: ${service_id}.`,
          },
        });
      }
    
      // Combine and return data
      return res.status(200).json({
        status: "success",
        message: "Service details retrieved successfully.",
        data: {
          mysql: mysqlData && mysqlData[0], // Take the first result from MySQL if available
          mongo: mongoData,
        },
      });
    };  
  
    export const getActiveServiceDetails = async (req, res) => {
      try {
        const query = `
          SELECT service_id, service_type, service_status 
          FROM service_type 
          WHERE service_status = 'Active'
        `;
    
        const fetchActiveServices = () =>
          new Promise((resolve, reject) => {
            db.mysqlConnection.query(query, (err, results) => {
              if (err) return reject(err);
              resolve(results);
            });
          });
    
        const activeServices = await fetchActiveServices();
    
        if (activeServices.length === 0) {
          return res.status(404).json({
            status: "error",
            message: "No active services found.",
            errors: {
              code: 404,
              description: "There are no services with active status.",
            },
          });
        }
    
        return res.status(200).json({
          status: "success",
          message: "Active services retrieved successfully.",
          data: activeServices,
        });
    
      } catch (err) {
        console.error("Error retrieving active services:", err);
        return res.status(500).json({
          status: "error",
          message: "Failed to retrieve active services.",
          errors: {
            code: 500,
            description: "An unexpected error occurred while fetching active services.",
          },
        });
      }
    };
  // export const Register_Service_Type = async (req, res) => {
  //   try{
      
  //     const {service_type} = req.body;
      
  //     if (!service_type) {
  //       return res.status(400).json({
  //         message: "service_type is required.",
  //       });
  //     }

  //     const mongoConnection = await db.connectMongoDB();
  //     if (!mongoConnection) {
  //       // return res.status(500).json({
  //       //   message: "Database connection failed.",
  //       // });
  //       throw new Error('MongoDB connection failed');
  //     }
  //     const counterResult = await mongoConnection.collection("counters").findOneAndUpdate(
  //       { _id: "service_id" },
  //       { $inc: { seq: 1 } },
  //       { returnDocument: "after", upsert: true }
  //     );
  //     console.log(counterResult);
  //     if (!counterResult || !counterResult.seq) {
  //       throw new Error("Failed to generate service_id");
  //     }
      
  //     const seq_service_id = counterResult.seq;

  //     if (!seq_service_id) {
  //       throw new Error('Failed to generate service_id');
  //     }
  //     const default_service_type_status = "Active";
      
  //     const newService = new Service({
  //       service_type,
  //       service_status:default_service_type_status,
  //       service_id:seq_service_id,
  //     });

  //     await newService.save();

  //     const insertServiceQuery = `
  //     INSERT INTO service_type (service_id, service_type, service_status)
  //     VALUES (?, ?, ?)
  //   `;
  //   const valuesForQuery = [seq_service_id, service_type, default_service_type_status];

  //   await new Promise((resolve, reject)=>{
  //     db.mysqlConnection.query(insertServiceQuery, valuesForQuery, (err, result) => {
  //       if (err) {
  //         console.error("Error MYSQL inserting service data:", err);
  //         reject(err);
  //       }else {
  //         resolve(result); 
  //       }
  //     });
  //   })
  //     res.status(200).json({
  //       message: "Service data stored successfully",
  //       service: newService,
  //     });

  //   }catch(err){
  //     console.error("Error storing service data:", err);
  //     res.status(500).json({
  //       message: "Error storing service data",
  //       error: err.message,
  //     });
  //   }
  // };

  export const Register_Service_Type = async (req, res) => {
    try {
      const { service_type } = req.body;
  
      if (!service_type) {
        return res.status(400).json({
          message: "service_type is required.",
        });
      }
  
      const mongoConnection = await db.connectMongoDB();
      if (!mongoConnection) {
        throw new Error('MongoDB connection failed');
      }
  
      const counterResult = await mongoConnection.collection("counters").findOneAndUpdate(
        { _id: "service_id" },
        { $inc: { seq: 1 } },
        { returnDocument: "after", upsert: true }
      );
  
      // Correctly extract the sequence ID from the top-level structure
      if (!counterResult || !counterResult.seq) {
        throw new Error("Failed to generate service_id");
      }
  
      const seq_service_id = counterResult.seq;
  
      const default_service_type_status = "Active";
  
      const newService = new Service({
        service_type,
        service_status: default_service_type_status,
        service_id: seq_service_id,
      });
  
      await newService.save();
  
      const insertServiceQuery = `
        INSERT INTO service_type (service_id, service_type, service_status)
        VALUES (?, ?, ?)
      `;
      const valuesForQuery = [seq_service_id, service_type, default_service_type_status];
  
      await new Promise((resolve, reject) => {
        db.mysqlConnection.query(insertServiceQuery, valuesForQuery, (err, result) => {
          if (err) {
            console.error("Error MYSQL inserting service data:", err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
  
      res.status(200).json({
        message: "Service data stored successfully",
        service: newService,
      });
  
    } catch (err) {
      console.error("Error storing service data:", err);
      res.status(500).json({
        message: "Error storing service data",
        error: err.message,
      });
    }
  };
  
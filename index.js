const express = require("express");
const sql = require("mssql");
const cors = require('cors');
app.use(cors());

const app = express();
const port = 1000;

// MSSQL Database connection configuration
const dbConfig = {
  user: "finify",
  password: "E7c5h3o2",
  server: "3.140.82.112",
  database: "finify",
  options: {
    encrypt: true, // For Azure; set to false for local SQL Server
    trustServerCertificate: true, // Required for self-signed certificates
  },
};

// GET route to fetch current status
app.get("/get-status", async (req, res) => {
  try {
    // Connect to the MSSQL database
    const pool = await sql.connect(dbConfig);

    // Fetch current status for id = 11
    const result = await pool
      .request()
      .query("SELECT status FROM dbo.Finify_Sheba_Features WHERE id = 11");

    // Close the connection to the database
    await pool.close();

    // If status is found, return it
    if (result.recordset.length > 0) {
      res.json({ status: result.recordset[0].status });
    } else {
      res.status(404).json({ message: "Status not found for ID 11" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

// POST route to toggle status (as previously)
app.post("/toggle-status", async (req, res) => {
  const newStatus = req.query.status; // Pass status in query, e.g., ?status=1 or ?status=0
  if (newStatus !== "0" && newStatus !== "1") {
    return res.status(400).json({ message: "Invalid status value. Use 0 or 1." });
  }

  try {
    // Connect to the MSSQL database
    const pool = await sql.connect(dbConfig);

    // Update the status only for id = 11
    const result = await pool
      .request()
      .input("newStatus", sql.Int, newStatus) // Pass newStatus as an input parameter
      .query("UPDATE dbo.Finify_Sheba_Features SET status = @newStatus WHERE id = 11");

    // Close the connection to the database
    await pool.close();

    // Return response
    res.json({ message: `Status updated to ${newStatus} for ID 11` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://3.140.82.112:${port}`);
});

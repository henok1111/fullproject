// Function to fetch clients
export const getCaseClients = async (db, req, res) => {
    try {
      const clients = await db.query("SELECT * FROM clients");
   // Log the clients
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  // Function to fetch advocates
  export const getCaseAdvocates = async (db, req, res) => {
    try {
      const advocates = await db.query("SELECT * FROM advocators");
       // Log the advocates
      res.json(advocates);
    } catch (error) {
      console.error("Error fetching advocates:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
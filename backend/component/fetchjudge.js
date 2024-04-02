const FetchJudges = async (req, res) => {
  try {
    const query = "SELECT id, first_name, last_name FROM users WHERE role = 'judge'";
    const [results] = await global.pool.query(query);
    console.log("fetched judge ", results); // Log SQL results
    res.json(results);
  } catch (error) {
    console.error("Error fetching judges:", error);
    console.log(res); // Log the res object
    if (res.status) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    } else {
      console.error("res object does not have status method");
    }
  }
};

export default FetchJudges;

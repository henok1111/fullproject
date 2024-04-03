const FetchJudges = async (req, res) => {
  try {
    const query = "SELECT id, first_name, last_name FROM users WHERE role = 'judge'";
    const [results] = await global.pool.query(query);
    // Log SQL results
    res.json(results);
  } catch (error) {
   
    if (res.status) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    } else {
      console.error("res object does not have status method");
    }
  }
};

export default FetchJudges;

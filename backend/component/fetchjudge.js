const Fetchjudge = () => async (req, res) => {
  try {
    const query =
      "SELECT id, first_name, last_name FROM judge WHERE status = $1";
    const result = await pool.query(query, ["active"]); // Assuming 'active' is a valid status for judges

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching judges:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default Fetchjudge;

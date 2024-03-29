const FetchCaseType = async (req, res) => {
  try {
    const [results] = await global.pool.query(
      "SELECT id, case_type_name FROM case_type"
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching case type: ", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export default FetchCaseType;

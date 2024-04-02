const GetCaseCount = async (req, res) => {
    try {
      const [results] = await global.pool.query(
        "SELECT COUNT(case_id) AS caseCount FROM cases"
      );
      const { caseCount } = results[0];
      res.json({ count: caseCount });
    } catch (error) {
      console.error("Error fetching case count: ", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };
  
  export default GetCaseCount;
  
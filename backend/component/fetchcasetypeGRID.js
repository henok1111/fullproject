const FetchCaseTypeGrid = async (req, res) => {
  try {
    const [results] = await global.pool.query(`
          SELECT
            ct.id AS case_type_id,
            ct.case_type_name,
            cst.id AS case_subtype_id,
            cst.sub_type_name
          FROM
            case ct
          LEFT JOIN
            case_sub_type cst ON ct.id = cst.case_type_id
        `);

    // Organize the results into an object where each case type has an array of its associated subtypes
    const caseTypes = {};
    results.forEach(
      ({ case_type_id, case_type_name, case_subtype_id, sub_type_name }) => {
        if (!caseTypes[case_type_id]) {
          caseTypes[case_type_id] = {
            id: case_type_id,
            name: case_type_name,
            subtypes: [],
          };
        }
        if (case_subtype_id) {
          // Ensure the case has a subtype
          caseTypes[case_type_id].subtypes.push({
            id: case_subtype_id,
            name: sub_type_name,
          });
        }
      }
    );

    // Convert the object of case types into an array
    const caseTypesArray = Object.values(caseTypes);

    res.json(caseTypesArray);
  } catch (error) {
    console.error("Error fetching case types: ", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export default FetchCaseTypeGrid;

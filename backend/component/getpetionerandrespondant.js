export const GetPetitioners = async (db, req, res) => {
  const caseId = req.params.caseId;
  try {
    const [petitioners] = await db.query(
      "SELECT clients.first_name, clients.email, clients.mobile_number FROM clients INNER JOIN petitioner_case_map ON clients.id = petitioner_case_map.client_id WHERE petitioner_case_map.case_id = ?",
      [caseId]
    );
    console.log("Petitioners:", petitioners); // Log the petitioners
    res.json(petitioners);
  } catch (error) {
    console.error("Error fetching petitioners:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetRespondents = async (db, req, res) => {
  const caseId = req.params.caseId;
  try {
    const [respondents] = await db.query(
      "SELECT clients.first_name, clients.email, clients.mobile_number FROM clients INNER JOIN respondent_case_map ON clients.id = respondent_case_map.client_id WHERE respondent_case_map.case_id = ?",
      [caseId]
    );
    console.log("Respondents:", respondents); // Log the respondents
    res.json(respondents);
  } catch (error) {
    console.error("Error fetching respondents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

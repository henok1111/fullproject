const uploadDocuments = async (db, req, res) => {
    try {
        const filePath = req.file.filename; // Get the path of the uploaded file
        console.log("Uploaded file path:", filePath); // Log the file path

        // Send a success response back to the client
        res.status(200).json({ message: "File uploaded successfully", filePath });
    } catch (error) {
        console.error("Error uploading file:", error);
        // Send an error response back to the client
        res.status(500).json({ error: "Failed to upload file" });
    }
};

export default uploadDocuments;
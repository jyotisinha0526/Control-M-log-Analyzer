const express = require('express');
const multer = require('multer');
const cors = require('cors');
const analyzeLog = require('./analyzer');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/analyze', upload.single('logfile'), (req, res) => {
    try {
        const result = analyzeLog(req.file.path);
		console.log(result); // 👈 ADD THIS
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate-embed', (req, res) => {
    const { url, title } = req.body;

    if (!url || !title) {
        return res.status(400).send('URL and Title are required.');
    }

    const embedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            font-family: Arial, sans-serif;
            background-color: #f7f9fc;
        }
        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }
        .logo {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #ffffff;
            border-radius: 16px;
            padding: 8px 20px;
            display: flex;
            align-items: center;
            box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .logo:hover {
            transform: scale(1.05);
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
        }
        .logo img {
            height: 28px;
            margin-right: 12px;
        }
        .logo span {
            font-size: 16px;
            font-weight: bold;
            color: #333333;
        }
    </style>
</head>
<body>
    <iframe src="${url}" title="${title}"></iframe>
    <div class="logo">
        <img src="https://i.imgur.com/RQzJluf.jpeg" alt="Powered by Heru Embeder">
        <span>Powered by Heru</span>
    </div>
</body>
</html>`;

    const encodedHtml = Buffer.from(embedHtml).toString('base64');
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    <script>
        document.write(atob('${encodedHtml}'));
    </script>
</body>
</html>`;

    const fileName = `${title}.html`;
    const filePath = path.join(__dirname, 'public', fileName);

    fs.writeFile(filePath, htmlContent, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Failed to save the embed file.');
        }

        res.send(`Checked Embed Site: <a href="/${fileName}" target="_blank">${title}. html</a>`);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

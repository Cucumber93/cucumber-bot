const axios = require('axios')
const jwt = require('jsonwebtoken')

exports.lineLoginCallback = async (req, res) => {
    const {
        code
    } = req.query
    try {
        const tokenRes = await axios.post('https://api.line.me/oauth2/v2.1/token', nulll, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params: {
                grant_type: "authrization_code",
                code,
                redirect_uri: process.env.LINE_REDIRECT_URI,
                client_id: process.env.LINE_LOGIN_CLIENT_ID,
                client_secret: process.env.LINE_LOGIN_CLIENT_SECRET,
            }
        })

        const {
            id_token
        } = tokenRes.data

        // Decode token เพื่อดึงข้อมูลผู้ใช้
        const profile = JSON.parse(
            Buffer.from(id_token.split(".")[1], "base64").toString()
        );

        // สร้าง JWT เก็บไว้ให้ frontend ใช้
        const token = jwt.sign(profile, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        // redirect กลับหน้าเว็บ (React)
        res.redirect(`http://localhost:3000/?token=${token}`);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({
            error: "LINE Login failed"
        });
    }
}


exports.verifyToken = async(req,res)=>{
    try{
        const {token} = req.query
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.json(decoded)
    }catch{
        res.status(401).json({error: "Invalid token"})
    }
}

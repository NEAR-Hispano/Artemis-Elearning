const express = require('express');
const app = express(),
bodyParser = require("body-parser");
const morgan = require('morgan');
port = 3070;

const cors = require('cors');
const multer  = require('multer')

const web3storage = require('web3.storage')

const { Web3Storage, File } = web3storage

app.use(morgan('dev'))
app.use(cors({
  origin: '*'
}));


app.use(bodyParser.json());
app.use(express.static(process.cwd() + '/my-app/dist'));

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ4MzhCMjE0MDRDRjM2RjY4Rjk4RGJGMTg2NGE2MTU3MDc3N0VGOTciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTE3NjExNTkwNTUsIm5hbWUiOiJpcGZzIn0._Z1-K1hzKNGWGLwE5jaN3rehwrVpXTyagjSOYLxdk2k"

app.post('/api/ipfs/files', cors(), multer().array('files'), async function (req, res) {
  if (req.files) {
    var item = []
    for (var i = 0; i < req.files.length; i++) {
      const client = new Web3Storage({ token })
      const files = [
        new File([req.files[i].buffer], req.files[i].originalname)
      ]
      const cid = await client.put(files)

      item.push({ data: cid, nombre: req.files[i].originalname })
    }
    res.json(item)
  } else {
    res.json(req.body)
  }
});

app.post('/api/ipfs', cors(), multer().single('file'), async function (req, res) {
  if (req.file) {
    const client = new Web3Storage({ token })
    const files = [
      new File([req.file.buffer], req.file.originalname)
    ]
    const cid = await client.put(files)

    return res.json({ data: cid, nombre: req.file.originalname })
  } else {
    res.json(req.body)
  }
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
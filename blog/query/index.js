const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = {id,title,comments:[]}
    }
    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        posts[postId].comments.push({id,content,status})
    }
    if (type === 'CommentUpdated') {
        
        const { id, content, postId, status } = data;
        console.log("status",status)
        const post = posts[postId];
        let comment = post.comments.find(comment => comment.id = id)
        comment.status = status;
    }
}

app.get('/posts', (req, res) => {
  res.send(posts);  
})

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    handleEvent(type, data)
    res.send({});
})


app.listen(4002, async() => {
    console.log("listening on 4002")
   const res =  await axios.get('http://localhost:4005/events');

    for (let event of res.data) {
        console.log('Prrocessinf eventt', event);
        handleEvent(event.type,event.data)
    }
})
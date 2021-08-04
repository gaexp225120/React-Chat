const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const {addUser,getUser,removeUser,getUserInRoom} = require('./users.js');

const PORT = process.env.PORT || 5000;



const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);


io.on('connection', (socket) => {
    socket.on('join',({name,room},error_callback)=>{
        const {error,user} = addUser({id:socket.id,name,room});

        if(error) return error_callback(error);

        socket.join( user.room );
        socket.emit('message',{ user: 'admin',text: `${ user.name },welcome to ${ room }`});
        socket.broadcast.to( user.room ).emit('message',{ user: 'admin',text:`${ user.name }has join`})

        error_callback();
    });

    socket.on('sendMessage',(message,callback) =>{
        const user = getUser(socket.id);
        io.to(user.room).emit('message',{ user: user.name , text: message })
    } )

    socket.on('disconnect', () => {
        console.log('disconnected');
      });

  });


server.listen(PORT, () => console.log(`Server activate ${PORT}`));
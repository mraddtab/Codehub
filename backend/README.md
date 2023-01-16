# Backend Documentation

## How to Use Backend
|   Folder          |   Description                                                             |
|   --              |   --                                                                      |
|   `config`        |   Connects to MongoDB                                                     |
|   `controllers`   |   Tells the server what to do for a request                               |
|   `middleware`    |   Does nothing at the moment. Will be used to show error page             |
|   `models`        |   Like a Class but for MongoDB. We will have user class in MongoDB        |
|   `routes`        |   Tells server where users can go (Ex: Can go to '/login' or '/register'  |

When you see `'/..something here..'` it means users can go to `'localhost:5000/...something here...'`
If you want to add a location users can go to (Ex: Can go to note page buy going to `'localhost:5000/note'`) you need to add `'/note'` on the routes page.

When you want to tell the backend what to do when they get there, go to `controllers` folder and add another **const** variable that follows the format:

```js
const /*...something...*/ = (req, res) => {
    /*...do something here...*/
};
```

If you want to hash password follow this tutorial: https://www.youtube.com/watch?v=enopDSs3DRw&t=826s

Right now, the controller page still needs hash password implementation

```js
// @desc    Authenticate user
// @route   POST /login
// @access  Public
const authenticateUser = (req, res) => {
    res.json({message: 'Authenticating User'});
    /*...implementation goes here, delete above when you get started...*/
};
```





## Node.js (v14.17.3)
**Description**  
Node.js is an asynchronous event-driven JavaScript runtime [^1]

**Use Case**  
Server language used to handle HTTP Connections

## Express.js
**Description**  
Node.js framework providing HTTP utilities that implement headers and routing [^2]

**Use Case**  
Will be used to create routings and actions in the backend

## Nodemon
**Description**  
“A tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected”[^3]

**Use Case**  
Will be used to speed development by not having to constantly reload the server while changing backend code.

## MongoDB Atlas
**Description**  
"Atlas simplifies deploying and managing your databases while offering the versatility you need to build resilient and performant global applications on the cloud providers of your choice."[^4]

**Use Case**  
Will host user data while prototyping application

[^1]: https://nodejs.org/en/about/
[^2]: https://expressjs.com/en/guide/routing.html
[^3]: https://github.com/remy/nodemon#nodemon
[^4]: https://docs.atlas.mongodb.com
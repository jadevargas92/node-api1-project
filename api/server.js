// BUILD YOUR SERVER HERE

//Imports at the top
const express = require('express')
const User = require('./users/model')

// Instance of Express App
const app = express();

// Global Middleware
app.use(express.json())

// [GET] / Hellow World end point TEST
app.get('/', (req, res) => {
    res.send('Hello World from express app!')
})
// MVP
// [POST] /api/users (Creates a user using the information sent inside the request body.)
app.post('/api/users', async (req, res) => {
    const data = req.body
    // const newUser = await User.insert(data)
    // res.status(201).json(newUser)
    if (!data.name || !data.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" })
    } else {
        User.insert(data)
            .then(newUser => {
                res.status(201).json(newUser)
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the user to the database" })
            })
    }

})
// [GET] /api/users (Returns an array users.)
app.get('/api/users', async (req, res) => {
    // const users = await User.find()
    // res.json(users)
    User.find()
        .then(users => {
            console.log(users)
            res.status(200).json(users)
        }).catch(err => {
            res.status(500).json({ message: "The users information could not be retrieved" })
        })
})
// [GET] /api/users:id (Returns the user object with the specified id)
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    // const user = await User.findById(id)
    // res.json(user)
    User.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            } else {
                res.status(200).json(user)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The user information could not be retrieved" })
        })
})
// [DELETE] /api/users:id (	Removes the user with the specified id and returns the deleted user)
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deletedUser = await User.remove(id)
        if (!deletedUser) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        } else {
            res.status(201).json(deletedUser)
        }

    } catch (err) {
        res.status(500).json({ message: "The user could not be removed" })
    }
})
// [PUT] /api/users:id (Updates the user with the specified id using data from the request body. Returns the modified user)
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params
    const changes = req.body

    try {
        if (!changes.name || !changes.bio) {
            res.status(400).json({ message: "Please provide name and bio for the user" })
        } else {
            const updatedUser = await User.update(id, changes)
            if (!updatedUser) {
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            } else {
                res.status(200).json(updatedUser)
            }
        }
    } catch (err) {
        res.status(500).json({ message: "The user information could not be modified" })
    }
})


module.exports = app; // EXPORT YOUR SERVER instead of {}
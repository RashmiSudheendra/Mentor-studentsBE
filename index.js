const express = require('express')
var cors = require('cors')
const { MongoClient, ObjectId} = require('mongodb')
const app = express()
app.use(express.json())
app.use(cors())
const dbUrl = 'mongodb+srv://studentManagement:studentManagement@cluster0.kslse6m.mongodb.net/'
const client = new MongoClient(dbUrl)
const mongodb = require('mongodb')

// creating new mentor
app.post('/createMentor', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        const db = await client.db("Student_Mentor_Management");
        let mentor = await db.collection("mentorData").findOne({ email: req.body.email })
        if (!mentor) {
            // console.log(req.body)
            await db.collection("mentorData").insertOne(req.body);
            res.status(201).send({ message: 'New mentor created', data: req.body })
        }
        else {
            res.status(400).send({ message: `Mentor with ${req.body.email} already exist` })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// getting all created mentors
app.get('/getAllMentor', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        const db = await client.db("Student_Mentor_Management");
        let mentor = await db.collection("mentorData").find().toArray()
        if (mentor.length == 0) {
            res.status(404).send({ message: 'No mentor created yet !' })
        }
        else {
            res.status(200).send({ data: mentor })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// creating new student
app.post('/createStudent', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        const db = await client.db("Student_Mentor_Management");
        let student = await db.collection("studentData").findOne({ email: req.body.email })
        if (!student) {
            // console.log(req.body)
            await db.collection("studentData").insertOne(req.body);
            res.status(201).send({ message: 'New student created successfully', data: req.body })
        }
        else {
            res.status(400).send({ message: `Student with ${req.body.email} already exist` })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// getting all students
app.get('/allStudents', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        const db = await client.db("Student_Mentor_Management");
        let student = await db.collection("studentData").find().toArray()
        if (student.length == 0) {
            res.status(404).send({ message: 'No student created yet !' })
        }
        else {
            res.status(200).send(student)
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// getting mentor by Id
app.get('/mentor/:id', async (req, res) => {
    console.log("called")
    const client = await MongoClient.connect(dbUrl);
    try {
        // console.log('connected')
        const db = await client.db("Student_Mentor_Management");
        let mentor = await db.collection("mentorData").findOne({_id:new mongodb.ObjectId(req.params.id)})
        if (!mentor) {
            res.status(404).send({ message: `No mentor data found` })
        }
        else {
            res.status(200).send({ data: mentor })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// assigning/changing mentor for particular student 
app.put('/assigningMentor/:id', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        const db = await client.db("Student_Mentor_Management");
        let student = await db.collection("studentData").findOne({_id:new mongodb.ObjectId(req.params.id)})
        console.log(student)
        if (student) {
            await db.collection('studentData').updateOne({_id:new mongodb.ObjectId(req.params.id)}, { $set:{ mentor: req.body.mentor } })
            res.status(200).send({ message: `mentor assigned`})
        }
        else {
            res.status(404).send({ message: `No student data found` })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// getting student by name
app.get('/getStudent/:studentName', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        // console.log('connected')
        const db = await client.db("Student_Mentor_Management");
        let student = await db.collection("studentData").findOne({ studentName: req.params.studentName })
        if (!student) {
            res.status(404).send({ message: `No student data found associated with student name ${req.params.studentName}` })
        }
        else {
            res.status(200).send({ data: student })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// getting students info for a particular mentor
app.get('/getStudents/:mentor', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        // console.log('connected')
        const db = await client.db("Student_Mentor_Management");
        let student = await db.collection("studentData").find({ mentor: req.params.mentor }).toArray()
        console.log(student)
        if (student.length==0) {
            res.status(400).send({ message: `No students assigned to ${req.params.mentor}` })
        }
        else {
            res.status(200).send({ data: student })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})


// assigning student to mentor
app.post('/assigningStudent/:name', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        const db = await client.db("Student_Mentor_Management");
        let mentor = await db.collection("mentorData").findOne({ name: req.params.name })
        if (mentor) {
            let studInfo = await db.collection("mentorData").findOne({ studentName: req.body.studentName })
            if (!studInfo) {
                await db.collection("mentorData").insertOne({ name: req.params.name, studentName: req.body.studentName, email: req.body.email })
                await db.collection("studentData").deleteOne({studentName: req.body.studentName})
                res.status(200).send({ message: 'Student assigned to mentor', data: req.body })
            }
            else {
                res.status(400).send({ message: `${req.body.studentName} already assigned with ${req.params.name}` })
            }
        }
        else {
            res.status(400).send({ message: `No mentor data found associated with mentor name ${req.params.name}` })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})



app.listen(5000, () => console.log(`App is listening to 5000`))
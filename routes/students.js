const express = require('express');
const sqlite3 = require('sqlite3');
const studentsRouter = express.Router();

const db = new sqlite3.Database('database.db');

/*----------------CRUD requests-------------------*/

studentsRouter.get('/', (req, res, next) => {
    const sql = 'SELECT * FROM Students';

    db.all(sql, (error, students) => {
        if(error) {
            next(error);
        } else {
            res.status(200).json({students});
        };
    });
});

studentsRouter.param('studentId', (req, res, next, studentId) => {
    const sql = `SELECT * FROM Students WHERE id = ${studentId}`;

    db.get(sql, (error, student) => {
        if(error) {
            next(error);
        } else if (student) {
            req.student = student;
            next();
        } else {
            res.sendStatus(400);
        };
    });
});

studentsRouter.get('/:studentId', (req, res, next) => {
    const sql = `SELECT * FROM Students WHERE id = ${req.params.studentId}`;

    db.get(sql, (error, student) => {
        if(error) {
            next(error);
        } else {
            res.status(200).json({student});
        };
    });
});

studentsRouter.post('/', (req, res, next) => {
    const name = req.body.student.name;
    const surname = req.body.student.surname;
    const paymentRate = req.body.student.payment_rate;

    const sql = `INSERT INTO Students (name, surname, payment_rate) VALUES ($name, $surname, $paymentRate)`;
    const data = {
        $name: name,
        $surname: surname,
        $paymentRate: paymentRate
    };

    db.run(sql, data, function (error) {
        if(error) {
            next(error);
        } else {
            const sql = `SELECT * FROM Students WHERE id = ${this.lastID}`;
            db.get(sql, (error, student) => {
                if(error) {
                    next(error);
                } else {
                    res.status(201).send({student});
                };
            });
        };
    });
});

studentsRouter.put('/:studentId', (req, res, next) => {
    const name = req.body.student.name;
    const surname = req.body.student.surname;
    const paymentRate = req.body.student.payment_rate;

    const sql = `UPDATE Students SET name=$name, surname=$surname, payment_rate=$paymentRate WHERE id=${req.student.id}`;
    const data = {
        $name: name,
        $surname: surname,
        $paymentRate: paymentRate
    };

    db.run(sql, data, (error) => {
        if(error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Students WHERE id = ${req.student.id}`, (error, student) => {
                res.status(201).json({student});
            });
        };
    });
});

studentsRouter.delete('/:studentId', (req, res, next) => {
    const sql = `DELETE FROM Students WHERE id=${req.student.id}`;

    db.run(sql, (error) => {
        if(error) {
            next(error);
        } else {
            res.sendStatus(204);
        };
    });
});

/* ---------------------SPECIAL REQ-------------------- */

studentsRouter.get('/:studentId/total-payments', (req, res, next) => {
    const sql = `SELECT student_id, SUM(payment_amount) AS total_payments
                FROM Payments
                WHERE student_id = ${req.student.id}`;

    db.get(sql, (error, totalPayments) => {
        if(error) {
            next(error);
        } else {
            res.status(200).json({totalPayments});
        };
    });
});

studentsRouter.get('/:studentId/total-lessons', (req, res, next) => {
    const sql = `SELECT student_id, COUNT(*) AS total_lessons FROM Lessons
                WHERE student_id = ${req.student.id}`;

    db.get(sql, (error, totalLessons) => {
        if(error) {
            next(error);
        } else {
            res.status(200).json({totalLessons});
        };
    });
});

module.exports = studentsRouter;
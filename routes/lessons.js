const express = require('express');
const sqlite3 = require('sqlite3');
const lessonsRouter = express.Router();

const db = new sqlite3.Database('database.db');

lessonsRouter.get('/', (req, res, next) => {
    const sql = 'SELECT * FROM Lessons';

    db.all(sql, (error, lessons) => {
        if(error) {
            next(error);
        } else {
            res.status(200).json({lessons});
        };
    });
});

lessonsRouter.param('lessonId', (req, res, next, lessonId) => {
    const sql = `SELECT * FROM Lessons WHERE id = ${lessonId}`;

    db.get(sql, (error, lesson) => {
        if(error) {
            next(error);
        } else if (lesson) {
            req.lesson = lesson;
            next();
        } else {
            res.sendStatus(400);
        };
    });
});

lessonsRouter.get('/:lessonId', (req, res, next) => {
    const sql = `SELECT * FROM Lessons WHERE id = ${req.params.lessonId}`;

    db.get(sql, (error, lesson) => {
        if(error) {
            next(error);
        } else {
            res.status(200).json({lesson});
        };
    });
});

lessonsRouter.post('/', (req, res, next) => {
    const studentId = req.body.lesson.student_id;
    const date = req.body.lesson.date;
    const lessonLength = req.body.lesson.lesson_length;

    const sql = `INSERT INTO Lessons (student_id, date, lesson_length) VALUES ($studentId, $date, $lessonLength)`;
    const data = {
        $studentId: studentId,
        $date: date,
        $lessonLength: lessonLength
    };

    db.run(sql, data, function (error) {
        if(error) {
            next(error);
        } else {
            const sql = `SELECT * FROM Lessons WHERE id = ${this.lastID}`;
            db.get(sql, (error, lesson) => {
                if(error) {
                    next(error);
                } else {
                    res.status(201).send({lesson});
                };
            });
        };
    });
});


lessonsRouter.put('/:lessonId', (req, res, next) => {
    const studentId = req.body.lesson.student_id;
    const date = req.body.lesson.date;
    const lessonLength = req.body.lesson.lesson_length;

    const sql = `UPDATE Lessons SET student_id=$studentId, date=$date, lesson_length=$lessonLength WHERE id=${req.lesson.id}`;
    const data = {
        $studentId: studentId,
        $date: date,
        $lessonLength: lessonLength
    };

    db.run(sql, data, (error) => {
        if(error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Lessons WHERE id = ${req.lesson.id}`, (error, lesson) => {
                res.status(201).json({lesson});
            });
        };
    });
});

lessonsRouter.delete('/:lessonId', (req, res, next) => {
    const sql = `DELETE FROM Lessons WHERE id=${req.lesson.id}`;

    db.run(sql, (error) => {
        if(error) {
            next(error);
        } else {
            res.sendStatus(204);
        };
    });
});

module.exports = lessonsRouter;
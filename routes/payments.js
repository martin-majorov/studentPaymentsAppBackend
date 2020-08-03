const express = require('express');
const sqlite3 = require('sqlite3');
const paymentsRouter = express.Router();

const db = new sqlite3.Database('database.db');

paymentsRouter.get('/', (req, res, next) => {
    const sql = 'SELECT * FROM Payments';

    db.all(sql, (error, payments) => {
        if(error) {
            next(error);
        } else {
            res.status(200).json({payments});
        }
    });
});

paymentsRouter.param('paymentId', (req, res, next, paymentId) => {
    const sql = `SELECT * FROM Payments WHERE id = ${paymentId}`;

    db.get(sql, (error, payment) => {
        if(error) {
            next(error);
        } else if (payment) {
            req.payment = payment;
            next();
        } else {
            res.sendStatus(400);
        };
    });
});

paymentsRouter.get('/:paymentId', (req, res, next) => {
    const sql = `SELECT * FROM Payments WHERE id = ${req.params.paymentId}`;

    db.get(sql, (error, payment) => {
        if(error) {
            next(error);
        } else {
            res.status(200).json({payment});
        };
    });
});

paymentsRouter.post('/', (req, res, next) => {
    const studentId = req.body.payment.student_id;
    const date = req.body.payment.date;
    const paymentAmount = req.body.payment.payment_amount;

    const sql = `INSERT INTO Payments (student_id, date, payment_amount) VALUES ($studentId, $date, $paymentAmount)`;
    const data = {
        $studentId: studentId,
        $date: date,
        $paymentAmount: paymentAmount
    };

    db.run(sql, data, function (error) {
        if(error) {
            next(error);
        } else {
            const sql = `SELECT * FROM Payments WHERE id = ${this.lastID}`;
            db.get(sql, (error, payment) => {
                if(error) {
                    next(error);
                } else {
                    res.status(201).send({payment});
                };
            });
        };
    });
});

paymentsRouter.put('/:paymentId', (req, res, next) => {

    const date = req.body.payment.date;
    const paymentAmount = req.body.payment.payment_amount;

    const sql = `UPDATE Payments SET date=$date, payment_amount=$paymentAmount WHERE id=${req.payment.id}`;
    const data = {
        $date: date,
        $paymentAmount: paymentAmount
    };

    db.run(sql, data, (error) => {
        if(error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Payments WHERE id = ${req.payment.id}`, (error, payment) => {
                res.status(201).json({payment});
            });
        };
    });
});

paymentsRouter.delete('/:paymentId', (req, res, next) => {
    const sql = `DELETE FROM Payments WHERE id=${req.payment.id}`;

    db.run(sql, (error) => {
        if(error) {
            next(error);
        } else {
            res.sendStatus(204);
        };
    });
});

module.exports = paymentsRouter;
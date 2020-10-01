const express = require("express");
const cors = require("cors");
const app = express();
const Razorpay = require('razorpay')
const instance = new Razorpay({
    key_id: 'rzp_test_g8mWnIWUL163x6',
    key_secret: 'MfqRVg85Bt7o3n8BTjiWr1BU',
});
app.use(cors());

app.get("/customer", (req, res) => {
    try {
        const options = {
            "name": req.body.firstname ? req.body.firstname : '',
            "email": req.body.email ? req.body.email : '',
            "contact": req.body.contact ? req.body.contact : '',
            "fail_existing": "0",
            "notes": {
                "address": "Webinar",
                "postal_code": req.body.postal_code ? req.body.postal_code : '',
                "country": req.body.country ? req.body.country:""
            }
        };
        instance.customers.create(options, async function (err, customer) {
            if (err) {
                return res.status(500).json({
                    message: "Something Went Wrong",
                });
            }
            return res.status(200).json(customer);
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong",
        });
    }
});

app.get("/order", (req, res) => {
    try {
        const options = {
            "amount": 0,
            "currency": "INR",
            "method": "emandate",
            "payment_capture": "1",
            "customer_id": req.body.customer_id,
            "receipt": "Receipt No. 1",
            "notes": {
                "notes_key_1": "Webinar"
            },
            "token": {
                "auth_type": req.body.auth_type,
                "max_amount": 9999900,
                "expire_at": 4102444799,
                //   "bank_account": {
                //     "beneficiary_name": "Gaurav Kumar",
                //     "account_number": "1121431121541121",
                //     "account_type": "savings",
                //     "ifsc_code": "HDFC0000001"
                //   },
                //   "notes": {
                //     "notes_key_1": "",
                //   }
            }
        };
        instance.orders.create(options, async function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: "Something Went Wrong",
                });
            }
            return res.status(200).json(order);
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong",
        });
    }
});


app.get("/capture/:paymentId", (req, res) => {
    try {
        const options = {
            "customer_id": req.body.customer_id?req.body.customer_id:'',
            "order_id": req.body.order_id?req.body.order_id:'',
            recurring: 1
        };
        instance.payments.capture(options, async function (err, payment) {
            if (err) {
                return res.status(500).json({
                    message: "Something Went Wrong",
                });
            }
            return res.status(200).json(payment);
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong",
        });
    }
});

app.listen(8000, () => {
    console.log("Server is listening at http://localhost:8000");
});
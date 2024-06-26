const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");

const transactionSchema = new mongoose.Schema({
    info: {
        type: String,
        default: "",
    },
    payment_id: {
        type: String,
        default: "",
    },
    order_id: {
        type: String,
        default: "",
    },
    customer: {
        type: ObjectId,
        default: null,
        ref: "Customer",
    },
    user: {
        type: ObjectId,
        default: null,
        ref: "User",
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        default: "PAID",
        enums: ["PAID", "REFUND"],
    },
    item: {
        type: ObjectId,
        default: null,
        required: true,
        ref: "Product",
    },
    quantity: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Transaction = mongoose.model("Transactions", transactionSchema);

module.exports = Transaction;

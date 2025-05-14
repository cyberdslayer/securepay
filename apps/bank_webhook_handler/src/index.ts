import express from "express";
import db from "@repo/db/client";
import { number } from "prop-types";
const app = express();

app.use(express.json())

app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    const paymentInformation: {
        token: string;
        amount: string;
    } = {
        token: req.body.token,
        amount: req.body.amount || "0"
    };

    try {
        // Logging the payment information for debugging purposes
        console.log('Received payment information:', paymentInformation);

        // First find the transaction by token to get the correct userId
        const transaction = await db.onRampTransaction.findUnique({
            where: {
                token: paymentInformation.token
            }
        });

        if (!transaction) {
            console.error('Transaction not found for token:', paymentInformation.token);
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        const userId = transaction.userId;
        const amount = transaction.amount; // Use the amount from our transaction record

        const isBalanceExist = await db.balance.findFirst({
            where: {
                userId: userId
            }
        });

        await db.$transaction([
            isBalanceExist == undefined ? 
            db.balance.create({
                data: {
                    userId: userId,
                    amount: amount,
                    locked: 0
                }
            }) : 
            db.balance.updateMany({
                where: {
                    userId: userId
                },
                data: {
                    amount: {
                        increment: amount
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        });
    } catch(e) {
        // Logging the error for debugging purposes
        console.error('Error while processing webhook:', e);
        res.status(500).json({
            message: "Error while processing webhook"
        });
    }
})

app.listen(3003);
import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import GithubProvider from "next-auth/providers/github"
import { SessionProvider } from "next-auth/react";

export const authOptions = {

    
    providers: [
      // Regular credentials provider (existing)
      CredentialsProvider({
          id: 'credentials',
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "999-999-9999", required: true },
            password: { label: "Password", type: "password",placeholder:"Make a strong password", required: true }
          },
          // TODO: User credentials type from next-aut
          async authorize(credentials: any) {
            // Do zod validation, OTP validation here
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const existingUser = await db.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            if (existingUser) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.number
                    }
                }
                return null;
            }

            try {
                const user = await db.user.create({
                    data: {
                        number: credentials.phone,
                        password: hashedPassword
                    }
                });
                
                await db.balance.create({
                    data:{
                        userId: user.id,
                        amount: 0,
                        locked: 0
                    }
                })
            
                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.number
                }
            } catch(e) {
                console.error(e);
            }

            return null
          },
        }),
        
        // New SRP credentials provider
        CredentialsProvider({
          id: 'srp',
          name: 'SRP Authentication',
          credentials: {
            phoneNumber: { label: "Phone Number", type: "text", placeholder: "Enter your phone number" },
            userId: { label: "User ID", type: "text" },
            clientProof: { label: "Client Proof", type: "text" },
          },
          async authorize(credentials: any) {
            if (!credentials.userId || !credentials.phoneNumber) {
              return null;
            }

            try {
              // The SRP verification should have already happened in the API endpoints
              // Here we just need to retrieve the user since the proof was verified
              const user = await db.user.findFirst({
                where: {
                  id: parseInt(credentials.userId),
                  number: credentials.phoneNumber
                }
              });

              if (!user) {
                return null;
              }

              // Return the user for creating the session
              return {
                id: user.id.toString(),
                name: user.name || "",
                email: user.number // Using phone number as email for NextAuth
              };
            } catch (error) {
              console.error("SRP auth error:", error);
              return null;
            }
          }
        }),

        GithubProvider({
            clientId: 'Ov23liwJO6nF8rMxH9sJ',
            clientSecret: '2cae1b8a29008bfb2ca08bda978da3bc980a9089'
        })


    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        // TODO: can u fix the type here? Using any is bad
        async session({ token, session }: any) {
            session.user.id = token.sub

            return session
        }
    },
    pages: {
      signIn: '/auth/signin', // Custom sign-in page path
    }
  }

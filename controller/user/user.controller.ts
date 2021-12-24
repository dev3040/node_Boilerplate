import db from '../../models'; 
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname+'/.env' });


const User=db["User"]
export class UserController {
    static async register(req:any,res:any,next:any) {
        try{            
            //Validation for all the required fields
            let {email,firstName,password,lastName} = req.body;
            if(!(firstName && lastName && email && password)){
                throw new Error('Please fill all the required fields');
            }
            console.log(email)
            let existingEmail = await User.findOne({
                where: {
                    email: email
                }
            });

            if(existingEmail) {
                throw new Error('User already exists');
            }

            let hasedPassword = await bcrypt.hash(password, 10);

            let result = await User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hasedPassword
            });
            
            res.send(result);
        }
        catch(error:any) {
            res.status(500).json({error:error.message})
        }
    }

    static async login(req: any, res:any, next:any){
        try{
            let {email, password } = req.body;
            
            if(!(email && password)){
                throw new Error('Please enter email and password');
            }

            let userExists:any = await User.findOne({
                where: {
                    email: email
                }
            })
            if(!userExists){
                throw new Error('User does not exists')
            }

            let checkPassword = await bcrypt.compare(password, userExists.password);

            let secret:any = process.env.SECRET;


            if(!checkPassword) {
                throw new Error('Incorrect credentials')
            }
            else {
                let token = jsonwebtoken.sign({id:userExists.id}, secret ,{ expiresIn: '1h' })
                res.send({
                    token: token,
                    email: userExists.email
                })
            }
        }catch(error:any){
            res.status(500).json({error:error.message})
        };
    }
    
    static async getUser(req: any, res:any, next:any) {
        res.send(req.user);
    }
}
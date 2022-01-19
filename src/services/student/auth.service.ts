import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {isEmpty} from '../../utils/util';
import {LoginUserDto} from "../../dtos/loginUser.dto";
import {HttpException} from "../../exceptions/HttpException";
import {Student} from "../../entity/student";
import {DataStoredInToken, TokenData} from "../../interfaces/auth.interface";
import {UpdateStudentDto} from "../../dtos/updateStudent.dto";
import {SignUpUserDto} from "../../dtos/signUpUser.dto";

class AuthService{
    public async signUp(userData: SignUpUserDto){
        if (isEmpty(userData)) throw new HttpException(200, "You're not userData");

        const users: Student[] = await Student.find();
        const findUser = users.find(user => user.email === userData.email);
        if (findUser) throw new HttpException(200, `registered email`);

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const createUserData: Student = Student.create(userData);
        createUserData.password = hashedPassword;
        const result = await Student.save(createUserData);

        /**
         * add token
         */
        const tokenData = this.createToken(result);
        createUserData.access_token = tokenData.token;

        await Student.update(result.id, createUserData);
        //-------------------------------------------------------
        
        return await Student.findOne(result.id);
    }
    
    public async logIn(userData: LoginUserDto){
        if (isEmpty(userData)) throw new HttpException(200, "You're not userData");

        const users: Student[] = await Student.find();
        const findUser: Student = users.find(user => user.email === userData.email);
        if(!findUser) throw new HttpException(200, `You're email ${userData.email} not found`);

        const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
        if(!isPasswordMatching) throw new HttpException(200, "You're password not matching");

        /**
         * add token
         */
        const tokenData = this.createToken(findUser);

        const updateUserData = Student.create(findUser);
        updateUserData.access_token = tokenData.token;
        //-------------------------------------------------------
        
        await Student.update(updateUserData.id, updateUserData);
        const user: Student = await Student.findOne(updateUserData.id);
        
        return user;
        
    }
    public async logOut(userData){
        if(isEmpty(userData)) throw new HttpException(400, "You're not userData");
        const users: Student[] = await Student.find();

        const findUser: Student = users.find(user => user.email === userData.email && user.password === userData.password );
        if(!findUser) throw new HttpException(409, "You're not user");

        return findUser;

    }

    public createToken(user: Student): TokenData{
        const dataStoredInToken: DataStoredInToken = { id: user.id };
        const expiresIn : number = 60 * 60;

        return { expiresIn, token: jwt.sign(dataStoredInToken, 'secretKey', {expiresIn }) };
    }

    public createCooke(tokenData: TokenData): string{
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
    }
  
}

export default AuthService;
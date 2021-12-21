import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {isEmpty} from '@utils/util';
import {LoginUserDto} from "@dtos/loginUser.dto";
import {SignUpUserDto} from "@dtos/signUpUser.dto";
import {HttpException} from "@exceptions/HttpException";
import {Coach} from "@entity/coach";
import {DataStoredInToken, TokenData} from "@interfaces/auth.interface";
import {Student} from "@entity/student";

class AuthService{
    public async signUp(userData: SignUpUserDto){
        if (isEmpty(userData)) throw new HttpException(200, "You're not userData");

        const users: Coach[] = await Coach.find();
        const findUser = users.find(user => user.email === userData.email);
        if (findUser) throw new HttpException(200, `registered email`);

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const createUserData = Coach.create(userData);
        createUserData.password = hashedPassword;
        const result = await Coach.save(createUserData);

        /**
         * add token
         */
        const tokenData = this.createToken(result);
        createUserData.access_token = tokenData.token;

        await Coach.update(result.id, createUserData);
        //-------------------------------------------------------
        
        return await Coach.findOne(result.id);
    }

    public async logIn(userData: LoginUserDto){
        if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

        const users: Coach[] = await Coach.find();
        const findUser: Coach = users.find(user => user.email === userData.email);
        if(!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

        const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
        if(!isPasswordMatching) throw new HttpException(409, "You're password not matching");

        const tokenData = this.createToken(findUser);

        const updateUserData = Coach.create(findUser);
        updateUserData.access_token = tokenData.token;
        await Coach.update(updateUserData.id, updateUserData);
        const user: Coach = await Coach.findOne(updateUserData.id);

        return user;
    }

    public async logOut(userData){
        if(isEmpty(userData)) throw new HttpException(400, "You're not userData");

        userData.access_token = "";
        await Coach.update(userData.id, userData);
        
        const users: Coach[] = await Coach.find();
        const findUser: Coach = users.find(user => user.email === userData.email && user.password === userData.password );
        if(!findUser) throw new HttpException(409, "You're not user");

        return findUser;

    }

    public createToken(user: Coach): TokenData{
        const dataStoredInToken: DataStoredInToken = { id: user.id };
        const expiresIn : number = 60 * 60;

        return { expiresIn, token: jwt.sign(dataStoredInToken, 'secretKey', {expiresIn }) };
    }
    
}

export default AuthService;

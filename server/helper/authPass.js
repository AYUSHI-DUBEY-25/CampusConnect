import bcrypt from 'bcryptjs';

export const hashPassword= async(password)=>{
    try{
        const saltRounds=10;
        const hashedPassword= await bcrypt.hash(password,saltRounds);
        return hashedPassword;
    }catch(error){
        console.error("Error hashing password:", error);
    }
}

export const comparePassword= async(plainPassword,hashedPassword)=>{
    try{
        return await bcrypt.compare(plainPassword,hashedPassword);
    }catch(error){
        console.error("Error comparing passwords:", error);
    }
}
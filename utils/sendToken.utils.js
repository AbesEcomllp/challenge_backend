

export const sendToken = (res, user, message, statusCode=200)=>{
    const token = user.getJWTToken();
    const options = {
        expires: new Date(Date.now() + 1*24*60*60*1000 ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:"None",
        path: '/'
    }
        res.status(statusCode).cookie("token", token, options).json({
            success:true,
            message,
            token,
            user,
        })

}

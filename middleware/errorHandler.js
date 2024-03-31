const erroHandlerMiddleware = async(err,req,res,next)=>{
    console.log(err);
    return res.status(500).json({msg:'Something went wrong :(' , error:err})
}

module.exports = erroHandlerMiddleware
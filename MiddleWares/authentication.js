/* ------------------------- Acquiring Dependancies ------------------------- */
const jwt = require("jsonwebtoken");
const express = require("express");
const authController = require("../Controllers/authController");
require("dotenv").config();
/* -------------------------------------------------------------------------- */

/* --------------------------- Creating MiddleWare -------------------------- */
const login = (request, response, next)=>{
    authController(request.body).then( (profile)=>{
            let token = jwt.sign({
                email: profile.email,
                userName: profile.userName,
                role: profile.role
            }, process.env.key, );
            response.json({token:token});
        }
    ).catch(error=>{
        response.status(403);
        next(error);
    });   
}

const auth = ((request,response,next)=>{
    let authList = process.env.authList.split(" ");
    if (authList.includes(request.url)){
        let token = request.get("Authorization");
        if(token == null)
            throw Error("Un-Authorized!");
        token = token.split(" ")[1];
        let formData = jwt.decode(token, process.env.key);
        if(formData == null){
            throw Error("Un-Authorized!");
        }
        request.formData = formData;
    }
    next();
});
/* -------------------------------------------------------------------------- */

/* -------------------------- Exporting MiddleWare -------------------------- */
module.exports.login = login;
module.exports.auth = auth;
/* -------------------------------------------------------------------------- */
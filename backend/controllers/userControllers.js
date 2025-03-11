import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import Post from "../models/Post";
import User from "../models/User";
import Comment from '../models/Comment';
import { fileRemover } from "../utils/fileRemover";

export const registerUser= async (req, res, next) => {
    try {
        const { name, email, password} = req.body;

        //check whether the user exists or not
        let user = await User.findOne({email});

        if(user)
        {
           //return res.status(400).json({ message : "User have already registered." });
           throw new Error("User have already registered");
        }

        //creating a new user
        user=await User.create({
            name,
            email,
            password
        });
        return res.status(201).json({
            _id: user._id,
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            verified: user.verified,
            admin: user.admin,
            token: await user.generateJWT(),
        });
    } catch (error) {
        next(error);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        let user=await User.findOne({email});

        if(!user)
        {
            throw new Error("Email not found");
        }

        if(await user.comparePassword(password))
        {
            return res.status(201).json({
                _id: user._id,
                avatar: user.avatar,
                name: user.name,
                email: user.email,
                verified: user.verified,
                admin: user.admin,
                token: await user.generateJWT(),   
            });
        }
        else{
            throw new Error("Invalid email or password");
        }
    } catch (error) {
        next(error);
    }
}

export const userProfile = async (req, res, next) =>{
    try {
        let user = await User.findById(req.user._id);
        if(user) {
            return res.status(201).json({
                _id: user._id,
                avatar: user.avatar,
                name: user.name,
                email: user.email,
                verified: user.verified,
                admin: user.admin  
            });
        }
        else{
            let error = new Error("User not found");
            error.statusCode = 404;
            next(error);
        }
    } catch (error) {
        next(error);
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const userIdToUpdate = req.params.userId;
        let userId = req.user._id;
        if(!req.user.admin && userId!==userIdToUpdate){
            let error = new Error("Forbidden Resource");
            error.statusCode = 403;
            throw error;
        }

        let user = await User.findById(userIdToUpdate);
        if(!user){   //if user not found with this id
            throw new Error("User not found");
        }

        if(typeof req.body.admin!=="undefined" && req.user.admin){
            user.admin= req.body.admin;
        }

        user.name = req.body.name || user.name; //The line of code essentially says: "If req.body.name is defined (i.e., it has a value), update the user.name property with the value of req.body.name. If req.body.name is not defined or is falsy (e.g., null, undefined, or an empty string), leave user.name unchanged."
        user.email= req.body.email || user.email;
        if(req.body.password && req.body.password.length < 6) {
            throw new Error("Password length must be atleast 6 characters");
        } else if (req.body.password ){
            user.password= req.body.password;
        }

        const updatedUserProfile= await user.save();
        res.json({
            _id: updatedUserProfile._id,
            avatar: updatedUserProfile.avatar,
            name: updatedUserProfile.name,
            email: updatedUserProfile.email,
            verified: updatedUserProfile.verified,
            admin: updatedUserProfile.admin,
            token: await updatedUserProfile.generateJWT(),   
        });
    } catch (error) {
        next(error);
    }
} 

export const updateProfilePicture = async (req, res, next) =>{
    try {
        const upload = uploadPicture.single('profilePicture');  // The code uses a middleware function called uploadPicture. This middleware is designed to handle file uploads, specifically for a single file with the field name 'profilePicture'. The upload function is configured to work with this middleware, which processes the uploaded file.
        upload(req, res, async function(err){                   //This is the way Multer (a popular middleware for handling file uploads) is typically used. It processes the uploaded file and calls the provided function when the processing is complete.
            if(err)
            {
                const error = new Error("An unknown error occured while uploading - " + err.message);
                next(error);
            }
            else
            {
                if (req.file) {
                  let filename;
                  let updatedUser = await User.findById(req.user._id);
                  filename = updatedUser.avatar;
                  if (filename) {
                    fileRemover(filename);
                  }
                  updatedUser.avatar = req.file.filename;
                  await updatedUser.save();
                  res.json({
                    _id: updatedUser._id,
                    avatar: updatedUser.avatar,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                    admin: updatedUser.admin,
                    token: await updatedUser.generateJWT(),
                  });
                } else {
                  let filename;
                  let updatedUser = await User.findById(req.user._id);
                  filename = updatedUser.avatar;
                  updatedUser.avatar = "";
                  await updatedUser.save();
                  fileRemover(filename);
                  res.json({
                    _id: updatedUser._id,
                    avatar: updatedUser.avatar,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                    admin: updatedUser.admin,
                    token: await updatedUser.generateJWT(),
                  });
                }
            }
        })
    } catch (error) {
        next(error);
    }
}

export const getAllUsers = async(req,res,next) =>{
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if(filter){
            where.email = {$regex: filter, $options: "i"};    //i means case insensitive
        }
        let query = User.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await User.find(where).countDocuments();
        const pages = Math.ceil(total/pageSize);

        res.header({
            'x-filter': filter,
            'x-totalcount': JSON.stringify(total),
            'x-currentpage': JSON.stringify(page),
            'x-pagesize': JSON.stringify(pageSize),
            'x-totalpagecount': JSON.stringify(pages)
        });

        if(page > pages){
            return res.json([]);
        }

        const result = await query.skip(skip).limit(pageSize).sort({updatedAt: 'desc'});
    
        return res.json(result);

    } catch (error) {
        next(error);
    }
}

export const deleteUser = async(req,res,next)=>{
    try {
        let user = await User.findById(req.params.userId);
        if(!user){
            throw new Error("User not found");
        }
        const postsToDelete = await Post.find({user:user._id});
        const postIdsToDelete = postsToDelete.map(post => post._id);
        await Comment.deleteMany({
            post: {$in: postIdsToDelete}
        })
        await Post.deleteMany({
            _id: {$in: postIdsToDelete}
        })

        postsToDelete.forEach((post)=>{
            fileRemover(post.photo)
        })

        await user.remove();
        fileRemover(user.avatar);
        res.status(204).json({
            message:"User deleted successfully"
        })
    } catch (error) {
        next(error);
    }
}
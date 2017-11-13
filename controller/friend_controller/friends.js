const User = require('../../models/user_model');
const accountService = require('../../services/account_service');

exports.getPeople = function (req, res) {
	var popuatQuery = {
		path: 'profileImages',
		match: {
			IsActive: true
		}
	};
	var filter={
		 _id: { $nin: req.user._id } ,
	}
	accountService.getByFilter(filter, popuatQuery, null, (err, users) => {
		if (err) throw err;
		else res.json({
			success: true,
			msg: "Success",
			response: users
		});
	});
}

exports.sendFriendRequest=function(req,res){
	var frs=[];
	frs=req.user.friendRequestsSent;
	if(frs)
	{
		frs.push({touserId:req.body.reqUserId});
	}
	else{
		frs=[{touserId:req.body.reqUserId}];
	}
	accountService.findByIdAndUpdate(req.user._id,{friendRequestsSent:frs},(err,res)=>{
		if(err)
		{
			//console.log("Error",err);
			return err;
		}
		//console.log("Sucess",res)
	});
}
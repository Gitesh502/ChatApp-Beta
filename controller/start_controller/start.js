exports.welcome=function(req,res)
{
    var months = [
        {Value:1, Name:"Jan"},
        {Value:2, Name:"Feb"},
        {Value:3, Name:"Mar"},
        {Value:4, Name:"Apr"},
        {Value:5, Name:"May"},
        {Value:6, Name:"Jun"},
        {Value:7, Name:"Jul"},
        {Value:8, Name:"Aug"},
        {Value:9, Name:"Sep"},
        {Value:10, Name:"Oct"},
        {Value:11, Name:"Nov"},
        {Value:12, Name:"Dec"}
      ];
    res.render('pages/welcome',{
        loginErrors:null,
        daymonths:months,
        errors:null,
        borderRed:'border-red'
    });
}
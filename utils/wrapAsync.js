// module.exports=(fn)=>{
//     return (req,res,next)=>{
//         fn(req,res,next).catch(next);
//     }
// }
// module.exports = (fn) => {
//     return (req, res, next) => {
//         Promise.resolve(fn(req, res, next)).catch(next);
//     }
// };
module.exports = (fn) => {
    return (req, res, next) => {
        console.log('fn:', fn);  // Check what is being passed as fn
        Promise.resolve(fn(req, res, next)).catch(next);
    }
};

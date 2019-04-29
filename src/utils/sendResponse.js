const sendSuccess = (res, data) => {
    return res.json({success: true, data})
}
const sendError = (res, message) => {
    return res.status(200).json({success: false , message})
}

module.exports = {
    sendSuccess,
    sendError
}
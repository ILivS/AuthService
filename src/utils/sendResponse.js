const sendSuccess = (res, data) => res.json({success: true, data})
const sendError = (res, message) => res.status(200).json({success: false, message})

module.exports = {
    sendSuccess,
    sendError,
}

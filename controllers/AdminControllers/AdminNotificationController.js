const AdminNotificationModel = require("../../models/AdminModels/AdminNotificationModel");
const AdminNotificationOrderModel = require("../../models/AdminModels/AdminNotificationOrderModel");

const getNotificationsAdmin = async(req, res) => {
    try {
        const notifications = await AdminNotificationModel.find().sort({createdAt: -1});
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
}

const getNotificationsOrderAdmin = async(req, res) => {
    try {
        const notifications = await AdminNotificationOrderModel.find()
            .populate({
                path: 'orderId', //populating the orderId reference
                select: 'paymentMethod', //only include the paymentMethod field
            })
            .sort({createdAt: -1})
            .exec();

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};


const updateNotificationStatus = async(req, res) => {
    try {
        const {notificationId} = req.params;
        const {isRead, notificationType} = req.body;

        let updatedNotification;
        
        //check notificationType and update the corresponding model
        if(notificationType === 'order'){
            updatedNotification = await AdminNotificationOrderModel.findByIdAndUpdate(
                notificationId,
                {isRead},
                {new: true}
            );
        }else if(notificationType === 'expiration'){
            updatedNotification = await AdminNotificationModel.findByIdAndUpdate(
                notificationId,
                {isRead},
                {new: true}
            );
        } else{
            return res.status(400).json({ 
                message: 'Invalid notification type' 
            });
        }

        if(!updatedNotification){
            return res.status(404).json({ 
                message: 'Notification not found' 
            });
        }

        res.status(200).json(updatedNotification);
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};



module.exports = {
    getNotificationsAdmin,
    getNotificationsOrderAdmin,
    updateNotificationStatus
}

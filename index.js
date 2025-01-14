const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const middleware = require('./middlewares/middleware');
const path = require('path');

dotenv.config({ path: './.env' });
const app = express();

app.use(middleware);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Database connected'))
.catch((error) => console.log('Database not connected', error));

require('./jobs/resetDiscountsJob');
require('./jobs/deleteProductsJob');

//customer routes
app.use('/customerAuth', require('./routers/CustomerRouters/CustomerAuthRouter'));
app.use('/customerProduct', require('./routers/CustomerRouters/CustomerProductRouter'));
app.use('/customerCart', require('./routers/CustomerRouters/CustomerCartRouter'));
app.use('/customerOrder', require('./routers/CustomerRouters/CustomerOrderRouter'));
app.use('/customerNotification', require('./routers/CustomerRouters/CustomerNotificationRouter'));
app.use('/customerDatePicker', require('./routers/CustomerRouters/CustomerDateTimePickerRouter'));


//staff routes
app.use('/staffAuth', require('./routers/StaffRouters/StaffAuthRouters'));
app.use('/staffProduct', require('./routers/StaffRouters/StaffProductRouters'));
app.use('/staffOrders', require('./routers/StaffRouters/StaffOrdersRouter'));
app.use('/staffOrderWalkin', require('./routers/StaffRouters/StaffOrdersWalkinRouter'));
app.use('/staffOrderRefill', require('./routers/StaffRouters/StaffOrdersRefillRouter'));
app.use('/staffCart', require('./routers/StaffRouters/StaffCartRouter'));
app.use('/staffOrderOverview', require('./routers/StaffRouters/StaffOrderOverviewRouter'));
app.use('/staffAccounts', require('./routers/StaffRouters/StaffAccountsRouter'));
app.use('/staffNotifications', require('./routers/StaffRouters/StaffNotificationRouter'));

//admin routes
app.use('/adminAuth', require('./routers/AdminRouters/AdminAuthRouter'));
app.use('/adminProduct', require('./routers/AdminRouters/AdminProductRouter'));
app.use('/adminOrders', require('./routers/AdminRouters/AdminOrdersRouter'));
app.use('/adminAccounts', require('./routers/AdminRouters/AdminAccountsRouter'));
app.use('/adminReports', require('./routers/AdminRouters/AdminReportRouter'));
app.use('/adminOrderOverview', require('./routers/AdminRouters/AdminOrderOverviewRouter'));
app.use('/adminWorkinProgressProduct', require('./routers/AdminRouters/AdminWorkinProgressRouter'));
app.use('/adminCart', require('./routers/AdminRouters/AdminCartRouter'));
app.use('/adminOrderWalkin', require('./routers/AdminRouters/AdminOrdersWalkinRouter'));
app.use('/adminOrderRefill', require('./routers/AdminRouters/AdminOrdersRefillRouter'));
app.use('/adminDatePicker', require('./routers/AdminRouters/AdminDateTimePickerRouter'));
app.use('/adminProductCategory', require('./routers/AdminRouters/AdminProductCategoryRouter'));
app.use('/adminProductSize', require('./routers/AdminRouters/AdminProductSizeRouter'));
app.use('/adminUsers', require('./routers/AdminRouters/AdminUsersRouter'));
app.use('/adminNotifications', require('./routers/AdminRouters/AdminNotificationRouter'));

//use client app
app.use(express.static(path.join(__dirname, '/client/dist')));

//render cclient
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/client/dist/index.html')));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = 8000;
app.listen(port, () => console.log(`Server is running on ${port}`));
//admin page routes
export const adminRoutes = [
    '/admin/dashboard',
    '/admin/orders',
    '/admin/orders-pickup',
    '/admin/orders/details/:orderId',
    '/admin/orders-pickup/details/:orderId',
    '/admin/walkins',
    '/admin/refills',
    '/admin/inventory/finished-product',
    '/admin/inventory/workin-progress',
    '/admin/accounts',
    '/admin/reports/inventory-report',
    '/admin/reports/sales-report',
    '/admin/accounts/:id',
    '/admin/quick-sales',
    '/admin/order-summary/:orderId',
    '/admin/settings/:adminId'
];
  
export const isAdminRoute = (path) => {
    return adminRoutes.some(route => {
        if(route.includes(':')){
            const basePath = route.split('/:')[0];
            return path.startsWith(basePath);
        }
        return route === path;
    });
};
  
  //staff page routes
export const staffRoutes = [
    '/staff/dashboard',
    // '/staff/home',
    '/staff/products',
    '/staff/direct-orders',
    '/staff/direct-orders/details/:productId',
    '/staff/walkin',
    '/staff/refill',
    '/staff/payment',
    '/staff/orders',
    '/staff/orders-pickup',
    '/staff/orders/details/:orderId',
    '/staff/orders-pickup/details/:orderId',
    '/staff/settings/:staffId',
    '/staff/order-summary/:orderId',
    '/staff/accounts',
];
  
export const isStaffRoute = (path) => {
    return staffRoutes.some(route => {
        if(route.includes(':')){
            const basePath = route.split('/:')[0];
            return path.startsWith(basePath);
        }
        return route === path;
    });
};
  
//admin and staff login routes
export const adminStaffRoutes = [
    '/admin-staff-login',
];
  
export const isAdminStaffRoute = (path) => {
    return adminStaffRoutes.includes(path);
};
  
//customer page routes
export const customerRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/otp',
    '/about-us',
    '/contact',
    '/profile/:customerId',
    '/orders/:customerId',
    '/shop',
    '/shop/product',
    '/shop/product/details/:productId',
    '/cart/:customerId',
    '/checkout/:customerId',
    '/direct-checkout/:customerId',
    '/place-order/:customerId/:orderId',
    '/payable/:customerId',
];
  
export const isCustomerRoute = (path) => {
    return customerRoutes.some(route => {
        if(route.includes(':')){
            const basePath = route.split('/:')[0];
            return path.startsWith(basePath);
        }
        return route === path;
    });
};
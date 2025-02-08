import React, { useState } from 'react'
import '../../CSS/AdminCSS/AdminSettings.css';
import AdminOrderingComponent from '../../components/AdminComponents/AdminSettings/AdminOrderingComponent';
import AdminGeneralComponent from '../../components/AdminComponents/AdminSettings/AdminGeneralComponent';
import AdminNotificationsComponent from '../../components/AdminComponents/AdminSettings/AdminNotificationsComponent';
import AdminPromotionsComponent from '../../components/AdminComponents/AdminSettings/AdminPromotionsComponent';
import AdminInventoryComponent from '../../components/AdminComponents/AdminSettings/AdminInventoryComponent';
import AdminUserRolesComponent from '../../components/AdminComponents/AdminSettings/AdminUserRolesComponent';


function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('General');

    const tabs = ['General', 'Notifications', 'Promotions', 'Inventory', 'User Roles', 'Ordering'];

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'General':
                return <AdminGeneralComponent />;
            case 'Notifications':
                return <AdminNotificationsComponent />;
            case 'Promotions':
                return <AdminPromotionsComponent />;
            case 'Inventory':
                return <AdminInventoryComponent />;
            case 'User Roles':
                return <AdminUserRolesComponent />;
            case 'Ordering':
                return <AdminOrderingComponent />;
            default:
                return <div>Select a tab to view its content</div>;
        }
    };

  return (
    <div className='admin-settings-container'>
        <div className='settings-sidebar'>
        <ul>
            {
                tabs.map((tab) => (
                    <li
                    key={tab}
                    className={activeTab === tab ? 'active-tab' : ''}
                    onClick={() => setActiveTab(tab)}
                    style={{ position: 'relative' }}
                    >
                    {tab}
                    {
                        tab === 'Notifications' && (
                            <span className="notification-badge"></span>
                        )
                    }
                    </li>
                ))
            }
        </ul>

        </div>

        <div className='settings-content'>
            <h2>{activeTab} Settings</h2>
            {renderActiveTab()}
        </div>
    </div>
  )
}

export default AdminSettingsPage
// import React, { useState } from 'react'
// import '../../CSS/AdminCSS/AdminSettings.css';
// import AdminOrderingComponent from '../../components/AdminComponents/AdminSettings/AdminOrderingComponent';
// import AdminGeneralComponent from '../../components/AdminComponents/AdminSettings/AdminGeneralComponent';
// import AdminNotificationsComponent from '../../components/AdminComponents/AdminSettings/AdminNotificationsComponent';
// import AdminPromotionsComponent from '../../components/AdminComponents/AdminSettings/AdminPromotionsComponent';
// import AdminInventoryComponent from '../../components/AdminComponents/AdminSettings/AdminInventoryComponent';
// import AdminUserRolesComponent from '../../components/AdminComponents/AdminSettings/AdminUserRolesComponent';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function AdminSettingsPage() {
//     const [activeTab, setActiveTab] = useState('Ordering');

//     const tabs = ['General', 'Notifications', 'Promotions', 'Inventory', 'User Roles', 'Ordering'];

//     const handleTabClick = (tab) => {
//         if(tab === 'General'){
//             toast.info('This feature is not available yet, maybe soon!', {
//                 position: "top-right",
//                 autoClose: 3000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//             });
//             return;
//         }
//         setActiveTab(tab);
//     };

//     const renderActiveTab = () => {
//         switch (activeTab) {
//             case 'General':
//                 return <AdminGeneralComponent />;
//             case 'Notifications':
//                 return <AdminNotificationsComponent />;
//             case 'Promotions':
//                 return <AdminPromotionsComponent />;
//             case 'Inventory':
//                 return <AdminInventoryComponent />;
//             case 'User Roles':
//                 return <AdminUserRolesComponent />;
//             case 'Ordering':
//                 return <AdminOrderingComponent />;
//             default:
//                 return <div>Select a tab to view its content</div>;
//         }
//     };

//   return (
//     <div className='admin-settings-container'>
//         <div className='settings-sidebar'>
//             <ul>
//                 {
//                     tabs.map((tab) => (
//                         <li
//                         key={tab}
//                         className={activeTab === tab ? 'active-tab' : ''}
//                         onClick={() => handleTabClick(tab)}
//                         >
//                             {tab}
//                         </li>
//                     ))
//                 }
//             </ul>
//         </div>

//         <div className='settings-content'>
//             <h2>{activeTab} Settings</h2>
//             {renderActiveTab()}
//         </div>
        
//         <ToastContainer />
//     </div>
//   )
// }

// export default AdminSettingsPage

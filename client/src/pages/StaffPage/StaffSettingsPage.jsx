import React, { useState } from 'react'
import '../../CSS/StaffCSS/StaffSettings.css';
import StaffGeneralComponent from '../../components/StaffComponents/StaffSettings/StaffGeneralComponent';
import StaffNotificationsComponent from '../../components/StaffComponents/StaffSettings/StaffNotificationsComponent';
import StaffOrderingComponent from '../../components/StaffComponents/StaffSettings/StaffOrderingComponent';


function StaffSettingsPage() {
    const [activeTab, setActiveTab] = useState('General');

    const tabs = ['General', 'Notifications', 'Ordering'];

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'General':
                return <StaffGeneralComponent />;
            case 'Notifications':
                return <StaffNotificationsComponent />;
            case 'Ordering':
                return <StaffOrderingComponent />;
            default:
                return <div>Select a tab to view its content</div>;
        }
    };

  return (
    <div className='staff-settings-container'>
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

export default StaffSettingsPage
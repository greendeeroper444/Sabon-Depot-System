
import React, { useEffect, useState } from 'react'
import '../../../CSS/AdminCSS/AdminReports/InventoryReport.css';
import axios from 'axios';
import DatePicker from 'react-multi-date-picker';
import logoDepot2 from '../../../assets/icons/logo-3.png';
import cleanUp from '../../../assets/icons/clean-up.png';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const fetchBase64 = async(filename) => {
    const response = await fetch(filename);
    const text = await response.text();
    return text.trim();
};

function InventoryReport() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
    const [groupedReports, setGroupedReports] = useState({});
    const [inputFields, setInputFields] = useState({});
    const [activeInput, setActiveInput] = React.useState(null);
    const [leftLogoBase64, setLeftLogoBase64] = useState('');
    const [rightLogoBase64, setRightLogoBase64] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        if (selectedDates.length === 2) {
            groupReportsByDate();
        }
    }, [selectedDates, reports]);

    useEffect(() => {
        const fetchLogos = async() => {
            try {
                const leftLogo = await fetchBase64('/baseLogo2.txt');
                const rightLogo = await fetchBase64('/baseLogo3.txt');
                setLeftLogoBase64(leftLogo);
                setRightLogoBase64(rightLogo);
            } catch (error) {
                console.error('Error fetching logos:', error);
            }
        };

        fetchLogos();
        fetchReports();
    }, []);


    const fetchReports = async() => {
        try {
            const response = await axios.get('/adminReports/getInventoryReportsAdmin');
            const reportData = response.data;

            setReports(reportData);

            //initialize input fields for each report
            const initialFields = {};
            reportData.forEach((report) => {
                initialFields[report._id] = {
                    preparedBy: report.preparedBy || '',
                    checkedBy: report.checkedBy || '',
                    receivedBy: report.receivedBy || '',
                };
            });
            setInputFields(initialFields);

            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const groupReportsByDate = () => {
        const [startDate, endDate] = selectedDates.map((date) =>
            new Date(date).toISOString().split('T')[0]
        );
        const grouped = {};
        reports.forEach((report) => {
            const reportDate = new Date(report.reportDate).toISOString().split('T')[0];
            if(reportDate >= startDate && reportDate <= endDate){
                if (!grouped[reportDate]) grouped[reportDate] = [];
                grouped[reportDate].push(report);
            }
        });
        setGroupedReports(grouped);
    };

    const handleUpdateNames = async(reportId) => {
        try {
            const {preparedBy, checkedBy, receivedBy} = inputFields[reportId];
            const response = await axios.put('/adminReports/updateInventoryReportNames', {
                reportId,
                preparedBy,
                checkedBy,
                receivedBy,
            });
            alert(response.data.message);
            fetchReports();
        } catch (error) {
            setError(error);
            alert('Error updating report');
        }
    };

    const handleInputChange = (reportId, field, value) => {
        setInputFields((prev) => ({
            ...prev,
            [reportId]: {...prev[reportId], [field]: value},
        }));
    };

    const resetInputField = (reportId, field) => {
        setInputFields((prev) => ({
            ...prev,
            [reportId]: {...prev[reportId], [field]: ''},
        }));
    };


    const getHighlightedDates = () => {
        if(selectedDates.length < 2) return [];
        const [startDate, endDate] = selectedDates.map(date => new Date(date));
        const highlighted = [];
        const currentDate = new Date(startDate);
    
        while(currentDate <= endDate){
            highlighted.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
    
        return highlighted;
    };

    // const handleGenerateReport = () => {
    //     const doc = new jsPDF();
    
    //     //add logos and header
    //     doc.addImage(leftLogoBase64, 'PNG', 14, 10, 30, 30);
    //     doc.addImage(rightLogoBase64, 'PNG', 160, 10, 30, 30);
    //     doc.setFontSize(14).setTextColor(0, 0, 0).setFont(undefined, 'bold');
    //     doc.text('CLEAN UP SOLUTIONS ENTERPRISES, INC.', 50, 16);
    //     doc.setFontSize(10).setFont(undefined, 'normal');
    //     doc.text('Prk. Ubas, Brgy. Sto. Nino, Panabo City, Davao del Norte', 50, 22);
    //     doc.text('Tel: (084) 309-2454 / 0909-8970769', 50, 26);
    //     doc.text('FB Page: Sabon Depot-Mindanao', 50, 30);
    //     doc.setFontSize(12).setFont(undefined, 'bold');
    //     doc.text('FINISHED GOODS PRODUCTION REPORT', 14, 47);
    
    //     //add date
    //     const now = new Date();
    //     const formattedDate = new Intl.DateTimeFormat('en-US', {
    //         year: 'numeric',
    //         month: '2-digit',
    //         day: '2-digit',
    //     }).format(now);
    //     doc.setFontSize(10).setFont(undefined, 'normal');
    //     doc.text(`DATE: ${formattedDate}`, 14, 52);
    
    //     //generate report table
    //     doc.autoTable({
    //         startY: 60,
    //         head: [['PRODUCTS', 'UCM', 'QTY', 'REMARKS']],
    //         body: reports.map((report) => [
    //             report.productName,
    //             report.sizeUnit,
    //             report.quantity,
    //             report.remarks,
    //         ]),
    //         styles: { fontSize: 10, halign: 'center' },
    //         headStyles: {
    //             fillColor: [255, 255, 255],
    //             textColor: [0, 0, 0],
    //             lineWidth: 0.1,
    //             lineColor: [0, 0, 0],
    //         },
    //         bodyStyles: {
    //             fillColor: [255, 255, 255],
    //             textColor: [0, 0, 0],
    //             lineWidth: 0.1,
    //             lineColor: [0, 0, 0],
    //         },
    //     });
    
    //     //add "prepared by", "checked by", and "received by" with inline icons
    //     const finalY = doc.autoTable.previous.finalY + 10;
    //     doc.setFontSize(10);
    
    //     reports.forEach((report, index) => {
    //         const offset = finalY + index * 15; //adjust spacing for each report row
    //         const preparedBy = inputFields[report._id]?.preparedBy || '_____________';
    //         const checkedBy = inputFields[report._id]?.checkedBy || '_____________';
    //         const receivedBy = inputFields[report._id]?.receivedBy || '_____________';
        
    //         //X-coordinates for each section
    //         const preparedX = 14;
    //         const checkedX = 80;
    //         const receivedX = 150;
        
    //         //labels
    //         doc.text('Prepared by:', preparedX, offset);
    //         doc.text('Checked by:', checkedX, offset);
    //         doc.text('Received by:', receivedX, offset);
        
    //         //names
    //         doc.text(preparedBy, preparedX, offset + 6);
    //         doc.text(checkedBy, checkedX, offset + 6);
    //         doc.text(receivedBy, receivedX, offset + 6);
        
    //         //underscores for signature lines
    //         doc.text('________________', preparedX, offset + 7);
    //         doc.text('________________', checkedX, offset + 7);
    //         doc.text('________________', receivedX, offset + 7);
    //     });
        
    //     //save the PDF
    //     doc.save('Inventory_Report.pdf');
    // };

    const handleGenerateReport = () => {
        const doc = new jsPDF();
    
        //add logos
        doc.addImage(leftLogoBase64, 'PNG', 14, 10, 30, 30);
        doc.addImage(rightLogoBase64, 'PNG', 160, 10, 30, 30);
    
        //report Header
        doc.setFontSize(14).setFont(undefined, 'bold').setTextColor(0, 0, 0);
        doc.text('CLEAN UP SOLUTIONS ENTERPRISES, INC.', 50, 16);
        doc.setFontSize(10).setFont(undefined, 'normal');
        doc.text('Prk. Ubas, Brgy. Sto. Nino, Panabo City, Davao del Norte', 50, 22);
        doc.text('Tel: (084) 309-2454 / 0909-8970769', 50, 26);
        doc.text('FB Page: Sabon Depot-Mindanao', 50, 30);
        doc.setFontSize(12).setFont(undefined, 'bold');
        doc.text('FINISHED GOODS PRODUCTION REPORT', 14, 47);
    
        let startY = 60;
    
        //iterate through grouped reports by date
        Object.keys(groupedReports).forEach((date) => {
            doc.setFontSize(12).setFont(undefined, 'bold');
            doc.text(`Date: ${date}`, 14, startY);
            startY += 5;
    
            //table Headers
            const tableHeaders = [['PRODUCTS', 'UCM', 'QTY', 'REMARKS']];
    
            //table Data
            const tableData = groupedReports[date].map((report) => [
                report.productName,
                report.sizeUnit,
                report.quantity,
                report.remarks,
            ]);
    
            //generate Table
            doc.autoTable({
                startY,
                head: tableHeaders,
                body: tableData,
                styles: {fontSize: 10, halign: 'center'},
                headStyles: {
                    fillColor: [240, 240, 240],
                    textColor: [0, 0, 0],
                    lineWidth: 0.1,
                    lineColor: [0, 0, 0],
                },
                bodyStyles: {
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    lineWidth: 0.1,
                    lineColor: [0, 0, 0],
                },
            });
    
            startY = doc.autoTable.previous.finalY + 10;
    
            //add signature section
            doc.setFontSize(10).setFont(undefined, 'normal');
            doc.text('Prepared by:', 14, startY);
            doc.text('Checked by:', 80, startY);
            doc.text('Received by:', 150, startY);
    
            const firstReport = groupedReports[date][0]; //use first report for names
            doc.text(inputFields[firstReport._id]?.preparedBy || '_____________', 14, startY + 6);
            doc.text(inputFields[firstReport._id]?.checkedBy || '_____________', 80, startY + 6);
            doc.text(inputFields[firstReport._id]?.receivedBy || '_____________', 150, startY + 6);
    
            startY += 15; //move down for the next section
        });
    
        //save PDF
        doc.save('Inventory_Report.pdf');
    };
    
  return (
    <div className='admin-inventory-report-container'>
        <div className='admin-inventory-report-header'>
            <button onClick={handleGenerateReport}>Download</button>
        </div>
        <div className='report-header'>
            <div>
                <img src={logoDepot2} alt="Logo" className='logo-inventory-report' />
            </div>
            <div className='report-title'>
                <h1>CLEAN UP SOLUTIONS ENTERPRISES, INC.</h1>
                <p>Prk. Ubas, Brgy. Sto. Nino, Panabo City, Davao del Norte</p>
                <p>(084) 309-2454/0930-8970769</p>
                <p>FB Page: Sabon Depot - Mindanao</p>
            </div>
            <div>
                <img src={cleanUp} alt="Clean Up" className='logo-inventory-report' />
            </div>
        </div>
        <div className='admin-inventory-report-details'>
            <h2>FINISHED GOODS PRODUCTION REPORT</h2>
            <p>Date: {selectedDates.length === 2 ? `${new Date(selectedDates[0]).toLocaleDateString()} - ${new Date(selectedDates[1]).toLocaleDateString()}` : ''}</p>
        </div>
        <DatePicker
        value={selectedDates}
        onChange={setSelectedDates}
        placeholder='Select dates'
        range={true}
        format='MMM DD, YYYY'
        className='date-picker-input'
        maxDate={new Date()}
        highlight={getHighlightedDates()}
        />
        {
            loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error loading reports.</p>
            ) : (
                <div className='admin-inventory-report-content'>
                {
                    Object.keys(groupedReports).map((date) => {
                        const reports = groupedReports[date]; //get all reports for this date
                        const firstReport = reports.length > 0 ? reports[0] : null; //pick the first report for the footer

                        return (
                            <div key={date} className='admin-inventory-report-date-section'>
                                <h2>Date: {new Date(date).toLocaleDateString()}</h2>
                                <table className='admin-inventory-report-table'>
                                    <thead>
                                        <tr>
                                            <th>PRODUCTS</th>
                                            <th>UCM</th>
                                            <th>QTY</th>
                                            <th>REMARKS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            reports.length > 0 ? (
                                                reports.map((report) => (
                                                    <tr key={report._id}>
                                                        <td>{report.productName}</td>
                                                        <td>{report.sizeUnit || 'N/A'}</td>
                                                        <td>{report.quantity}</td>
                                                        <td>{report.remarks}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4">No inventory report this day.</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>

                                {/* ahow the footer only once per date group */}
                                {
                                    firstReport && (
                                        <div key={firstReport._id} className='admin-inventory-report-footer'>
                                            {['preparedBy', 'checkedBy', 'receivedBy'].map((field) => (
                                                <div key={field}>
                                                    <p>{field.replace(/By$/, ' by:')}</p>
                                                    <div className='input-with-icons'>
                                                        <input
                                                            type="text"
                                                            className='input-line'
                                                            value={inputFields[firstReport._id]?.[field] || ''}
                                                            onChange={(e) => {
                                                                handleInputChange(firstReport._id, field, e.target.value);
                                                            }}
                                                            onFocus={() => setActiveInput({ id: firstReport._id, field })}
                                                            onBlur={() =>
                                                                inputFields[firstReport._id]?.[field]?.trim()
                                                                    ? null
                                                                    : setActiveInput(null)
                                                            }
                                                            placeholder="Enter name"
                                                        />
                                                        {
                                                            activeInput?.id === firstReport._id && activeInput?.field === field && (
                                                                <>
                                                                    <span
                                                                        className='icon check-icon'
                                                                        onClick={() => handleUpdateNames(firstReport._id)}
                                                                    >
                                                                        ✔️
                                                                    </span>
                                                                    <span
                                                                        className='icon times-icon'
                                                                        onClick={() => resetInputField(firstReport._id, field)}
                                                                    >
                                                                        ❌
                                                                    </span>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                            </div>
                        );
                    })
                }


                </div>
            )
        }
    </div>
  )
}

export default InventoryReport

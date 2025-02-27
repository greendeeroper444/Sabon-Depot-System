import React, { useEffect, useState } from 'react'
import '../../../CSS/AdminCSS/AdminReports/SalesReport.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-multi-date-picker';
import logoDepot from '../../../assets/icons/logo-depot.png';

const fetchBase64 = async (filename) => {
    const response = await fetch(filename);
    const text = await response.text();
    return text.trim();
};

function SalesReportPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
    const [leftLogoBase64, setLeftLogoBase64] = useState('');
    const [inputFields, setInputFields] = useState({});
    const [groupedReports, setGroupedReports] = useState({});
    const [activeInput, setActiveInput] = React.useState(null);

    useEffect(() => {
        const fetchLogos = async () => {
            const leftLogo = await fetchBase64('/baseLogo.txt');
            setLeftLogoBase64(leftLogo);
        };

        fetchLogos();
        fetchReports();
    }, []);

    useEffect(() => {
            fetchReports();
        }, []);
    
    useEffect(() => {
        if (selectedDates.length === 2) {
            groupReportsByDate();
        }
    }, [selectedDates, reports]);

    const fetchReports = async() => {
        try {
            const response = await axios.get('/adminReports/getSalesReportsAdmin');
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
    
    const getDateRange = () => {
        if(selectedDates.length === 0) return '';
        const sortedDates = [...selectedDates].sort((a, b) => new Date(a) - new Date(b));

        const startDate = new Date(sortedDates[0]).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const endDate = new Date(sortedDates[sortedDates.length - 1]).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        return startDate === endDate ? startDate : `${startDate} to ${endDate}`;
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

    const handleUpdateNames = async(reportId) => {
        try {
            const {preparedBy, checkedBy, receivedBy} = inputFields[reportId];
            const response = await axios.put('/adminReports/updateSalesReportNames', {
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

    const handleGenerateReport = () => {
        const doc = new jsPDF();
    
        //add logos
        doc.addImage(leftLogoBase64, 'PNG', 14, 10, 30, 30);
    
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
            const tableHeaders = [
                ['PRODUCT NAME', 'PRODUCT CODE', 'SIZE UNIT', 'CATEGORY', 'PRICE', 'UNITS SOLD', 'TOTAL REVENUE', 'DATE']
            ];
            
    
            //table Data
            const tableData = groupedReports[date].map((report) => [
                report.productName,
                report.productCode,
                report.sizeUnit,
                report.category,
                `Php ${report.price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
                report.unitsSold,
                `Php ${report.totalRevenue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
                new Date(report.reportDate).toLocaleDateString()
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
    <div className='sales-report-container'>
        <br />
        <br />
        <br />
        <br />
        <header className='sales-report-header'>
            <div className='company-info'>
                <img src={logoDepot} alt="Logo" className="logo" />
                <div>
                    <h1>CLEAN UP SOLUTIONS ENTERPRISES, INC.</h1>
                    <p>Prk. Ubos, Brgy. Sto. Niño, Panabo City, Davao del Norte</p>
                    <p>(084) 309-2454 / 0930-8970769</p>
                    <p>FB Page: Sabon Depot - Mindanao</p>
                </div>
            </div>
            <div className='report-title'>
                <h2>Sales Report</h2>
                <p>Date: {getDateRange()}</p>
            </div>
        </header>

        <div className='report-controls'>
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
            <button onClick={handleGenerateReport} className='print-button'>Download PDF</button>
        </div>

        {
            loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    {
                    Object.keys(groupedReports).map((date) => {
                        const reports = groupedReports[date]; //get all reports for this date
                        const firstReport = reports.length > 0 ? reports[0] : null; //pick the first report

                        return (
                            <div key={date}>
                                <table className='sales-report-table'>
                                    <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Product Code</th>
                                            <th>Size Unit</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Units Sold</th>
                                            <th>Total Revenue</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            reports.length > 0 ? (
                                                reports.map((report) => (
                                                    <tr key={report.productId}>
                                                        <td>{report.productName}</td>
                                                        <td>{report.productCode}</td>
                                                        <td>{report.sizeUnit}</td>
                                                        <td>{report.category}</td>
                                                        <td>{`Php ${report.price}`}</td>
                                                        <td>{report.unitsSold}</td>
                                                        <td>
                                                            {`Php ${
                                                                report.totalRevenue.toLocaleString('en-US', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                })
                                                            }`}
                                                        </td>
                                                        <td>{new Date(report.reportDate).toLocaleDateString()}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8">No sales reports for the selected dates.</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>

                                {/* show the footer only once per date group */}
                                {
                                    firstReport && (
                                        <div key={firstReport._id} className='admin-sales-report-footer'>
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

export default SalesReportPage

import React, { useEffect, useState } from 'react'
import '../../CSS/CustomerCSS/InvoiceModal.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import logoDepot2 from '../../assets/icons/logo-3.png';
import cleanUp from '../../assets/icons/clean-up.png';

function InvoiceModal({isOpen, onClose, order, subtotal, shippingCost}) {
    if (!isOpen) return null;

    const [leftLogoBase64, setLeftLogoBase64] = useState('');
    const [rightLogoBase64, setRightLogoBase64] = useState('');

    //function to convert image to Base64
    const fetchBase64 = (imgSrc) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous'; //avoid CORS issues
            img.src = imgSrc;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = (error) => reject(error);
        });
    };

    useEffect(() => {
        const fetchLogos = async () => {
            try {
                const leftLogo = await fetchBase64(logoDepot2);
                const rightLogo = await fetchBase64(cleanUp);
                setLeftLogoBase64(leftLogo);
                setRightLogoBase64(rightLogo);
            } catch (error) {
                console.error('Error fetching logos:', error);
            }
        };

        fetchLogos();
    }, []);

    const total = subtotal + shippingCost;

    const handleDownload = () => {
        const doc = new jsPDF();

        //add company logos
        if(leftLogoBase64) doc.addImage(leftLogoBase64, 'PNG', 14, 10, 30, 30);
        if(rightLogoBase64) doc.addImage(rightLogoBase64, 'PNG', 160, 10, 30, 30);

        //header
        doc.setFontSize(14).setFont(undefined, 'bold');
        doc.text('CLEAN UP SOLUTIONS ENTERPRISES, INC.', 50, 16);
        doc.setFontSize(10).setFont(undefined, 'normal');
        doc.text('Prk. Ubas, Brgy. Sto. Nino, Panabo City, Davao del Norte', 50, 22);
        doc.text('Tel: (084) 309-2454 / 0909-8970769', 50, 26);
        doc.text('FB Page: Sabon Depot-Mindanao', 50, 30);

        doc.setFontSize(12).setFont(undefined, 'bold');
        doc.text('INVOICE', 14, 47);
        doc.setFontSize(10).setFont(undefined, 'normal');

        //invoice Details
        let y = 60;
        doc.text(`Invoice ID: #${order.orderNumber}`, 14, y);
        y += 5;
        doc.text(`Due Date: ${new Date(order.createdAt).toLocaleString()}`, 14, y);
        y += 5;
        doc.text(`Billed to: ${order.billingDetails.firstName} ${order.billingDetails.lastName}`, 14, y);
        y += 5;
        doc.text(order.billingDetails.emailAddress, 14, y);
        y += 5;
        doc.text(`Payment Type: ${order.paymentMethod}`, 150, y);
        y += 5;
        doc.text(`Approved by: ${order.whoApproved}`, 150, y);
        y += 10;

        //table Header
        doc.autoTable({
            startY: y,
            head: [['Product', 'QTY', 'Unit Price', 'Amount']],
            body: order.items.map(item => [
                item.productName,
                item.quantity,
                `Php ${item.finalPrice.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
                `Php ${(item.finalPrice * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2})}`
            ]),
            theme: 'grid',
            styles: {fontSize: 10},
            headStyles: {fillColor: [0, 102, 204]},
        });

        let finalY = doc.lastAutoTable.finalY + 10;

        //summary
        doc.text(`Subtotal: Php ${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}`, 14, finalY);
        finalY += 5;
        doc.text(`Shipping: Php ${shippingCost.toLocaleString('en-US', {minimumFractionDigits: 2})}`, 14, finalY);
        finalY += 5;
        doc.text(`Total: Php ${total.toLocaleString('en-US', {minimumFractionDigits: 2})}`, 14, finalY);

        //save PDF
        doc.save(`Invoice_${order.orderNumber}.pdf`);
    };

  return (
    <div className='invoice-modal-backdrop'>
        <div className='invoice-modal'>
            <button className='close-button' onClick={onClose}>✖</button>
            <div className='invoice-header'>
                <div>
                    <img src={logoDepot2} alt='Logo' className='logo-inventory-invoice' />
                </div>
                <div className='invoice-title'>
                    <h3>CLEAN UP SOLUTIONS ENTERPRISES, INC.</h3>
                    <p>Prk. Ubas, Brgy. Sto. Nino, Panabo City, Davao del Norte</p>
                    <p>(084) 309-2454 / 0930-8970769</p>
                    <p>FB Page: Sabon Depot - Mindanao</p>
                </div>
                <div>
                    <img src={cleanUp} alt='Clean Up' className='logo-inventory-invoice' />
                </div>
            </div>
            <h5>Invoice ID# {order.orderNumber}</h5>
            <div className='divider-line'></div>
            <div className='invoice-details'>
                <div className='details-left'>
                    <p>Due Date: {new Date(order.createdAt).toLocaleString()}</p>
                    <p>Billed to: {order.billingDetails.firstName} {order.billingDetails.lastName} <br />
                        {order.billingDetails.emailAddress}
                    </p>
                </div>
                <div className='details-right'>
                    <p>Payment Type: {order.paymentMethod}</p>
                    <p>Approved by: {order.whoApproved}</p>
                </div>
            </div>
            <table className='invoice-table'>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>QTY</th>
                        <th>Unit Price</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        order.items.map(item => (
                            <tr key={item._id}>
                                <td>{item.productName}</td>
                                <td>{item.quantity}</td>
                                <td>Php {item.finalPrice.toFixed(2)}</td>
                                <td>Php {(item.finalPrice * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <button onClick={handleDownload} className='download-button'>Download Invoice</button>
        </div>
    </div>
  )
}

export default InvoiceModal

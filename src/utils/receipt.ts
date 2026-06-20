import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { Booking } from '../api/types';
import { getDisplayId } from './ids';

export const downloadReceiptPDF = async (booking: Booking) => {
  // Create a temporary element for the receipt
  const receiptDiv = document.createElement('div');
  receiptDiv.style.position = 'absolute';
  receiptDiv.style.left = '-9999px';
  receiptDiv.style.top = '0';
  receiptDiv.style.width = '350px';
  receiptDiv.style.backgroundColor = '#ffffff';
  receiptDiv.style.color = '#000000';
  receiptDiv.style.padding = '40px';
  receiptDiv.style.fontFamily = "'Courier New', Courier, monospace";
  receiptDiv.style.boxSizing = 'border-box';

  const bookingId = getDisplayId(booking);
  const dateStr = new Date(booking.created_at || new Date()).toLocaleDateString();
  const amount = booking.is_free_promo ? 'FREE' : `£${booking.amount?.toFixed(2) || '0.00'}`;
  const badgeText = booking.is_free_promo ? 'PROMO' : 'PAID';

  receiptDiv.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="font-weight: 900; font-size: 24px; letter-spacing: 2px;">BAZETWO</div>
      <div style="background: #000; color: #fff; display: inline-block; padding: 4px 12px; font-size: 12px; font-weight: 700; margin-top: 10px;">${badgeText}</div>
    </div>
    <div style="border-top: 1px dashed #ccc; margin: 20px 0;"></div>
    <div style="font-size: 13px; margin-bottom: 10px; display: flex; justify-content: space-between;">
      <span style="color: #666;">Order ID</span>
      <span style="font-weight: 700;">#${bookingId}</span>
    </div>
    ${booking.check_in_code ? `
    <div style="font-size: 13px; margin-bottom: 10px; display: flex; justify-content: space-between;">
      <span style="color: #666;">Check-In Code</span>
      <span style="font-weight: 700; color: #000;">${booking.check_in_code}</span>
    </div>
    ` : ''}
    <div style="font-size: 13px; margin-bottom: 20px; display: flex; justify-content: space-between;">
      <span style="color: #666;">Date</span>
      <span style="font-weight: 700;">${dateStr}</span>
    </div>
    <div style="border-top: 1px dashed #ccc; margin: 20px 0;"></div>
    <div style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div style="font-weight: 700; font-size: 15px;">${booking.service}</div>
          <div style="font-size: 12px; color: #666;">with ${booking.barber}</div>
        </div>
        <div style="font-weight: 700;">${amount}</div>
      </div>
    </div>
    <div style="border-top: 1px dashed #ccc; margin: 20px 0;"></div>
    <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 900; font-size: 18px; margin-top: 20px;">
      <span>Grand Total</span>
      <span>${amount}</span>
    </div>
    ${booking.check_in_code ? `
    <div style="border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; padding: 12px; margin: 15px 0; background-color: #fcfcfc; font-size: 11px; color: #333; text-align: left;">
      <div style="margin-bottom: 6px; display: flex; justify-content: space-between;">
        <span style="color: #666;">Patron Name:</span>
        <span style="font-weight: 700; color: #000;">${booking.guest_name || 'Registered Patron'}</span>
      </div>
      <div style="margin-bottom: 6px; display: flex; justify-content: space-between;">
        <span style="color: #666;">Service:</span>
        <span style="font-weight: 700; color: #000;">${booking.service}</span>
      </div>
      <div style="margin-bottom: 6px; display: flex; justify-content: space-between;">
        <span style="color: #666;">Schedule:</span>
        <span style="font-weight: 700; color: #000;">${new Date(booking.date).toLocaleDateString([], { dateStyle: 'short' })} ${new Date(booking.date).toLocaleTimeString([], { timeStyle: 'short' })}</span>
      </div>
      <div style="margin-bottom: 6px; display: flex; justify-content: space-between;">
        <span style="color: #666;">Booked On:</span>
        <span style="font-weight: 700; color: #000;">${booking.created_at ? new Date(booking.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}</span>
      </div>
      <div style="margin-bottom: 12px; display: flex; justify-content: space-between;">
        <span style="color: #666;">Code:</span>
        <span style="font-weight: 800; color: #d4af37; letter-spacing: 0.5px;">${booking.check_in_code}</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px;">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${booking.check_in_code}" style="width: 100px; height: 100px; border: 2px solid #000; padding: 4px; background-color: #fff;" alt="${booking.check_in_code}" />
        <span style="font-size: 8px; color: #666; margin-top: 6px; letter-spacing: 1px; font-weight: bold; text-transform: uppercase;">SCAN TO CHECK-IN</span>
      </div>
    </div>
    ` : ''}
    <div style="text-align: center; margin-top: 40px;">
      <div style="height: 40px; background: linear-gradient(to right, #000 0%, #000 5%, transparent 5%, transparent 7%, #000 7%, #000 15%, transparent 15%, transparent 20%, #000 20%, #000 22%, transparent 22%, transparent 25%, #000 25%, #000 40%, transparent 40%, transparent 45%, #000 45%, #000 48%, transparent 48%, transparent 50%, #000 50%, #000 70%, transparent 70%, transparent 75%, #000 75%, #000 85%, transparent 85%, transparent 90%, #000 90%, #000 100%); width: 100%; margin-bottom: 10px;"></div>
      <p style="font-size: 10px; letter-spacing: 1px; color: #999; margin: 0;">THANK YOU FOR CHOOSING EXCELLENCE</p>
    </div>
  `;

  document.body.appendChild(receiptDiv);

  try {
    const canvas = await html2canvas(receiptDiv, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`Bazetwo-Receipt-${bookingId}.pdf`);
  } finally {
    document.body.removeChild(receiptDiv);
  }
};

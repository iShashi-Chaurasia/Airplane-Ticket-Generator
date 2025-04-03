
document.addEventListener('DOMContentLoaded', function() {
  const ticketForm = document.getElementById('ticketForm');
  const ticket = document.getElementById('ticket');
  const downloadBtn = document.getElementById('downloadBtn');
  const loading = document.getElementById('formLoading');
  const successAlert = document.getElementById('successAlert');
  
  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;
  
  // Set default time to now + 1 hour
  const now = new Date();
  now.setHours(now.getHours() + 1);
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('time').value = `${hours}:${minutes}`;
  
  ticketForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading
    loading.style.display = 'block';
    
    // Simulate processing delay
    setTimeout(() => {
      // Get form values
      const passengerName = document.getElementById('passengerName').value;
      const flightNo = document.getElementById('flightNo').value;
      const from = document.getElementById('from').value;
      const to = document.getElementById('to').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const gate = document.getElementById('gate').value;
      const seat = document.getElementById('seat').value;
      
      // Format date
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      // Update ticket
      document.getElementById('ticketPassengerName').textContent = passengerName;
      document.getElementById('ticketFlightNo').textContent = flightNo;
      document.getElementById('ticketFrom').textContent = from;
      document.getElementById('ticketTo').textContent = to;
      document.getElementById('ticketDate').textContent = formattedDate;
      document.getElementById('ticketTime').textContent = time;
      document.getElementById('ticketGate').textContent = gate;
      document.getElementById('ticketSeat').textContent = seat;
      
      // Update barcode with flight info
      const barcodeData = `P:${passengerName}|F:${flightNo}|F:${from}|T:${to}|D:${date}|T:${time}|G:${gate}|S:${seat}`;
      document.getElementById('ticketBarcode').src = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(barcodeData)}&code=Code128&dpi=96`;
      
      // Show ticket and download button
      ticket.style.display = 'block';
      downloadBtn.style.display = 'block';
      successAlert.style.display = 'block';
      
      // Hide loading
      loading.style.display = 'none';
      
      // Scroll to ticket
      ticket.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  });
  
  downloadBtn.addEventListener('click', function() {
    // Use html2canvas to capture the ticket
    html2canvas(ticket).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`boarding-pass-${document.getElementById('flightNo').value}.pdf`);
    });
  });
});

// Initialize jsPDF
const { jsPDF } = window.jspdf;

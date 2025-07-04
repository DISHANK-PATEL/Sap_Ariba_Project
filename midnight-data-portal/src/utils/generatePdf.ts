
import jsPDF from 'jspdf';

/**
 * generatePdf Utility
 * Creates a PDF report from the provided data using jsPDF
 * Formats the data into a readable report structure
 */
export const generatePdf = async (data: any): Promise<void> => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set up document properties
    doc.setProperties({
      title: 'Jindal Shadeed Ariba Dashboard Report',
      subject: 'Data Analysis Report',
      author: 'Jindal Shadeed Ariba Dashboard',
      creator: 'React Dashboard Application'
    });

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Jindal Shadeed Ariba Dashboard', 20, 20);
    doc.text('Data Analysis Report', 20, 30);
    
    // Add generation timestamp
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 40);
    
    // Draw separator line
    doc.line(20, 45, 190, 45);
    
    let yPosition = 55;
    
    // Summary Section
    if (data?.summary) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Events: ${data.summary.totalEvents}`, 20, yPosition);
      yPosition += 5;
      doc.text(`Critical Events: ${data.summary.criticalEvents}`, 20, yPosition);
      yPosition += 5;
      doc.text(`Last Updated: ${new Date(data.summary.lastUpdated).toLocaleString()}`, 20, yPosition);
      yPosition += 15;
    }
    
    // Events Section
    if (data?.events && Array.isArray(data.events)) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Event Details', 20, yPosition);
      yPosition += 10;
      
      data.events.forEach((event: any, index: number) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${event.type?.toUpperCase() || 'EVENT'}`, 20, yPosition);
        yPosition += 7;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // Event details
        doc.text(`ID: ${event.id || 'N/A'}`, 25, yPosition);
        yPosition += 5;
        doc.text(`Severity: ${event.severity?.toUpperCase() || 'N/A'}`, 25, yPosition);
        yPosition += 5;
        
        // Description with text wrapping
        if (event.description) {
          const description = `Description: ${event.description}`;
          const splitDescription = doc.splitTextToSize(description, 165);
          doc.text(splitDescription, 25, yPosition);
          yPosition += splitDescription.length * 5;
        }
        
        // Metadata
        if (event.metadata && typeof event.metadata === 'object') {
          doc.text('Metadata:', 25, yPosition);
          yPosition += 5;
          
          Object.entries(event.metadata).forEach(([key, value]) => {
            const metadataText = `  • ${key}: ${JSON.stringify(value)}`;
            const splitMetadata = doc.splitTextToSize(metadataText, 160);
            doc.text(splitMetadata, 25, yPosition);
            yPosition += splitMetadata.length * 4;
          });
        }
        
        yPosition += 5; // Space between events
      });
    }
    
    // Add footer to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${pageCount}`, 20, 290);
      doc.text('Jindal Shadeed Ariba Dashboard - Confidential', 120, 290);
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `jindal-dashboard-report-${timestamp}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    console.log('PDF generated successfully:', filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};

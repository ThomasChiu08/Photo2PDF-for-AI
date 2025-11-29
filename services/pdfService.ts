import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates a PDF from a specific DOM element.
 * @param elementId The ID of the HTML element to render.
 * @param fileName The name of the output PDF file.
 */
export const generatePDF = async (elementId: string, fileName: string = 'report.pdf'): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id '${elementId}' not found.`);
  }

  // Temporary style adjustments to ensure full capture quality regardless of screen preview scale
  const originalTransform = element.style.transform;
  element.style.transform = 'none';

  try {
    // 1. Capture the element as a canvas
    // scale: 2 improves resolution for crisp text/images
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true, 
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    // 2. Calculate dimensions
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // 3. Add image to PDF with Scale-to-Fit logic
    // If the captured content is taller than A4, scale it down to fit one page.
    if (imgHeight > pdfHeight) {
      const ratio = pdfHeight / imgHeight;
      const finalWidth = pdfWidth * ratio;
      const finalHeight = pdfHeight;
      const xOffset = (pdfWidth - finalWidth) / 2; // Center horizontally
      
      pdf.addImage(imgData, 'PNG', xOffset, 0, finalWidth, finalHeight);
    } else {
      // Fits normally
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
    }

    // 4. Save
    pdf.save(fileName);
  } catch (error) {
    console.error('PDF Generation failed:', error);
    throw error;
  } finally {
    // Restore original styles
    element.style.transform = originalTransform;
  }
};
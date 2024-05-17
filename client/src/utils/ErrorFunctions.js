
import { ToastContainer, toast } from 'react-toastify';

export function handleFormErrors(formData,isHighstudy) {
      
      const formErrors = {};
      if (formData.isPlaced) {
        if (!formData.company.trim()) {
          formErrors.company = 'Company name cannot be blank';
          toast.error(formErrors.company);
          return;
        } else if (!formData.designation) {
          formErrors.designation = 'Designation cannot be blank';
          toast.error(formErrors.designation);
          return;
        } else if (!formData.appointmentNo) {
          formErrors.appointmentNo = 'Appointment No is required ';
          toast.error(formErrors.appointmentNo);
          return;
        } else if (!formData.appointmentDate) {
          formErrors.appointmentDate = 'Appointment Date cannot be blank';
          toast.error(formErrors.appointmentDate);
          return;
        } else if (!formData.appointmentLetter) {
          formErrors.appointmentLetter = 'Appointment Letter cannot be blank';
          toast.error(formErrors.appointmentLetter);
          return;
        } else if (!formData.package) {
          formErrors.package = 'Package cannot be blank';
          toast.error(formErrors.package);
          return;
        }
      } else if (formData.isPlaced === null) {
        formErrors.isPlaced = 'Placed or Not field cannot be blank';
        toast.error(formErrors.isPlaced);
        return;
      } else if (formData.highStudy === null) {
        formErrors.highStudy = 'High Study field cannot be blank';
        toast.error(formErrors.highStudy);
        return;
      } else if (isHighstudy && !formData.highStudyplace) {
        formErrors.highStudyplace = "Place of High Study Cannot be blank";
        toast.error(formErrors.highStudyplace);
        return;
      } else if (formData.gateStatus === null) {
        console.log("hello")
        formErrors.gateStatus = "Gate Status Field Cannot Be Blank";
        toast.error(formErrors.gateStatus);
        return;
      }
      else if (formData.gateStatus && !formData.gateCertificate) {
        formErrors.gateCertificate = "Please upload Gate Admit Card/ ScoreCard";
        toast.error(formErrors.gateCertificate);
        return;
      }
      return formErrors;
    }

export function handleFileErrors(appointmentFiledata) {
    const fileErrors = {};

    if (!isEmptyObject(appointmentFiledata)) {
        const sizestring = appointmentFiledata.size
        const sizeValue = parseInt(sizestring.replace(/\D/g, ''), 10);
        if (appointmentFiledata.type !== "application/pdf") {
            fileErrors.appointmentLetter = "Document must be in PDF format";
            toast.error(fileErrors.appointmentLetter);
          return;
        } else if (sizeValue > 500) {
            fileErrors.appointmentLetter = "Document size exceeds 500 KB";
            toast.error(fileErrors.appointmentLetter);
          return;
        }
    }
   

    return fileErrors;
}

function isEmptyObject(obj) {
    return typeof obj === 'object' && Object.keys(obj).length === 0 && obj.constructor === Object;
}

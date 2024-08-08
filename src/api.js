import axios from "axios";
import { decryptData } from "./Component/CRYPTO/crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create Axios instances
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_AQATO_AGENT_APPLICANT_PORTAL_BASE_API_URL,
  timeout: 30000,
});

const axiosInstanceNoAuth = axios.create({
  baseURL: process.env.REACT_APP_AQATO_AGENT_APPLICANT_PORTAL_BASE_API_URL,
  timeout: 30000,
});

// Response interceptor for axiosInstance
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const navigate = useNavigate();
    if (
      error?.response &&
      error?.response?.data &&
      error?.response?.data?.message === "Expired token"
    ) {
      //toast.error("Time elapsed, Please log in again!");
      console.log("Expired token error....");
      localStorage.clear();
      navigate("/");
    }
    return Promise.reject(error);
  }
);

// Function to authorize requests
export function authorizeMe() {
  const encryptedToken = localStorage.getItem("encryptedTokenForVendorOfHanaiHealth");
  const token = decryptData(encryptedToken);

  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
}

// Intercept requests and authorize them before sending
axiosInstance.interceptors.request.use(async (config) => {
  await authorizeMe();
  return config;
});

// API functions
export async function LoginAPI(data) {
  try {
    const response = await axiosInstanceNoAuth.post(`/vendorauth/login`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function LoginOtpAPI(data) {
  try {
    const response = await axiosInstanceNoAuth.post(`/vendorauth/verify-otp`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function ForgotPasswordEnterEmailAPI(data) {
  try {
    const response = await axiosInstanceNoAuth.post(`/vendorauth/forgotpass`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function ForgotPasswordEnterOtpAPI(data) {
  try {
    const response = await axiosInstanceNoAuth.post(`/vendorauth/forgototpverify`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function ForgotPasswordEnterNewPasswordAPI(data) {
  try {
    const response = await axiosInstanceNoAuth.post(`/vendorauth/changepassword`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function SignupAPI(data) {
  try {
    const response = await axiosInstanceNoAuth.post(`/vendorauth/signup`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function SignUpOtpAPI(data) {
  try {
    const response = await axiosInstanceNoAuth.post(`/vendorauth/verifysignupotp`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function LabReportAPI() {
  try {
    const response = await axiosInstance.get(`/vendor/labreport`);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function BillReportAPI() {
  try {
    const response = await axiosInstance.get(`/vendor/billreport`);
    return response;
  } catch (error) {
    throw error;
  }
}


export async function UploadPdfOfLabReport(formData){
  try {
    const response = await axiosInstance.post(`/vendor/uploadlabreport`,formData);
    return response;
  } catch (error) {
    throw error;
  }
}



// Example of the App component
const App = () => {
  useEffect(() => {
    authorizeMe();
  }, []);

  return (
    <>
    
    </>
  );
};

export default App;
export { axiosInstance, axiosInstanceNoAuth };
